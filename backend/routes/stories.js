const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Quest = require('../models/Quests');
const Persona = require('../models/Persona');
const authMiddleware = require('../middleware/auth');
const { generateQuestSnippet, generateBatchChapter } = require('../services/aiServices');

// Generate quest completion snippet
router.post('/quest-snippet', authMiddleware, async (req, res) => {
  try {
    const { questId } = req.body;

    // Get the completed quest
    const quest = await Quest.findById(questId);
    
    if (quest) {
      console.log('7. Quest details:', {
        _id: quest._id,
        title: quest.title,
        status: quest.status,
        userId: quest.userId
      });
    }

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    // ✅ Changed from req.user._id to req.userId
    if (quest.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (quest.status !== 'completed') {
      return res.status(400).json({ message: 'Quest must be completed first' });
    }

    // Get user's persona
    const persona = await Persona.findOne({ userId: req.userId });
    if (!persona) {
      return res.status(404).json({ message: 'Persona not found' });
    }

    // Generate the snippet
    const content = await generateQuestSnippet(
      persona,
      quest.title,
      quest.reflection
    );

    // Save to database
    const story = await Story.create({
      userId: req.userId,
      personaId: persona._id,
      content,
      storyType: 'quest_snippet',
      triggeredBy: questId,
      questTitle: quest.title
    });

    res.status(201).json(story);
  } catch (e) {
    console.error('Error in quest snippet generation:', e);
    res.status(500).json({ message: e.message });
  }
});

// Generate batch completion chapter
router.post('/batch-chapter', authMiddleware, async (req, res) => {
  try {
    const { batchNumber } = req.body;

    // Get all completed quests from this batch
    const completedQuests = await Quest.find({
      userId: req.userId,
      batchNumber,
      status: 'completed'
    });

    if (completedQuests.length === 0) {
      return res.status(400).json({ message: 'No completed quests in this batch' });
    }

    // Get user's persona
    const persona = await Persona.findOne({ userId: req.userId });
    if (!persona) {
      return res.status(404).json({ message: 'Persona not found' });
    }

    // Generate the chapter
    const content = await generateBatchChapter(
      persona,
      batchNumber,
      completedQuests.map(q => ({ questTitle: q.title }))
    );

    // Save to database
    const story = await Story.create({
      userId: req.userId,
      personaId: persona._id,
      content,
      storyType: 'batch_chapter',
      triggeredBy: `batch_${batchNumber}`,
      batchNumber
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error in batch chapter generation:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all user's stories (for viewing journey)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.userId })
      .sort({ generatedAt: -1 }); // Newest first

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;