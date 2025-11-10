const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://5amiegg2o_db_user:u1GSfeJ4V9vbH5Lq@parallelme.qhpqmhk.mongodb.net/?appName=ParallelMe');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;