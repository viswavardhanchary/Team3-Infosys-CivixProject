const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGOURI = process.env.MONGOURI
async function connectDataBase() {
  try {
    await mongoose.connect(MONGOURI);
    return;
  } catch (e) {
    return;
  }
}

module.exports = connectDataBase;