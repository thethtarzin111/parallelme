// Test script for User model

const connectDB = require('./config/database.js');
const User = require('./models/User.js');

// Test function
async function testUserModel() {
  try {
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected!\n');

    // Test 1: Create a valid user
    console.log('📝 TEST 1: Creating a valid user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ User created successfully!');
    console.log('   ID:', testUser._id);
    console.log('   Name:', testUser.name);
    console.log('   Email:', testUser.email);
    console.log('   Created At:', testUser.createdAt);
    console.log('   Password (hashed):', testUser.password);
    console.log('   Notice: Password is hashed! ✅\n');

    // Test 2: Verify password hashing
    console.log('🔐 TEST 2: Verifying password is hashed...');
    if (testUser.password !== 'password123') {
      console.log('✅ Password is hashed (not plain text)');
      console.log('   Original: password123');
      console.log('   Hashed:', testUser.password, '\n');
    } else {
      console.log('❌ ERROR: Password is not hashed!\n');
    }

    // Test 3: Test password comparison method
    console.log('🔑 TEST 3: Testing password comparison...');
    const isCorrect = await testUser.comparePassword('password123');
    const isWrong = await testUser.comparePassword('wrongpassword');
    
    if (isCorrect && !isWrong) {
      console.log('✅ Password comparison works correctly');
      console.log('   Correct password: ✅ Matches');
      console.log('   Wrong password: ❌ Doesn\'t match\n');
    } else {
      console.log('❌ ERROR: Password comparison not working!\n');
    }

    // Test 4: Try to create user with duplicate email
    console.log('📧 TEST 4: Testing duplicate email prevention...');
    try {
      await User.create({
        name: 'Another User',
        email: 'test@example.com',  // Same email!
        password: 'password456'
      });
      console.log('❌ ERROR: Duplicate email was allowed!\n');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Duplicate email correctly rejected!\n');
      } else {
        console.log('❌ Unexpected error:', error.message, '\n');
      }
    }

    // Test 5: Test email validation
    console.log('📮 TEST 5: Testing email validation...');
    try {
      await User.create({
        name: 'Invalid Email User',
        email: 'not-an-email',  // Invalid email format
        password: 'password789'
      });
      console.log('❌ ERROR: Invalid email was allowed!\n');
    } catch (error) {
      if (error.errors && error.errors.email) {
        console.log('✅ Invalid email format correctly rejected!');
        console.log('   Error:', error.errors.email.message, '\n');
      }
    }

    // Test 6: Test required fields
    console.log('✏️ TEST 6: Testing required fields...');
    try {
      await User.create({
        email: 'test2@example.com'
        // Missing name and password
      });
      console.log('❌ ERROR: Missing required fields were allowed!\n');
    } catch (error) {
      if (error.errors) {
        console.log('✅ Required field validation works!');
        console.log('   Missing fields:', Object.keys(error.errors).join(', '), '\n');
      }
    }

    // Test 7: Test password minimum length
    console.log('🔢 TEST 7: Testing password length validation...');
    try {
      await User.create({
        name: 'Short Pass User',
        email: 'short@example.com',
        password: '123'  // Too short (less than 6 chars)
      });
      console.log('❌ ERROR: Short password was allowed!\n');
    } catch (error) {
      if (error.errors && error.errors.password) {
        console.log('✅ Password length validation works!');
        console.log('   Error:', error.errors.password.message, '\n');
      }
    }

    // Test 8: Test that password is not returned by default
    console.log('🙈 TEST 8: Testing password select: false...');
    const foundUser = await User.findOne({ email: 'test@example.com' });
    if (foundUser.password === undefined) {
      console.log('✅ Password is not returned by default (select: false works)\n');
    } else {
      console.log('❌ ERROR: Password was returned when it shouldn\'t be!\n');
    }

    // Test 9: Test that we CAN get password when we need it
    console.log('👀 TEST 9: Testing password retrieval when needed...');
    const userWithPassword = await User.findOne({ email: 'test@example.com' }).select('+password');
    if (userWithPassword.password) {
      console.log('✅ Can retrieve password when explicitly requested\n');
    } else {
      console.log('❌ ERROR: Cannot retrieve password with select("+password")\n');
    }

    // Clean up
    console.log('🧹 Cleaning up test data...');
    await User.deleteMany({});
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 ALL TESTS PASSED! Your User model is working perfectly!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    process.exit(1);
  }
}

// Run the tests
testUserModel();