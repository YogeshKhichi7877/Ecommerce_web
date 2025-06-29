const mongoose = require('mongoose');

const mongoUrl = 'mongodb+srv://yogeshkhinchi2005:Ecommerce@cluster0.yo5cvct.mongodb.net/';

mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to mongoose database ');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.warn(' MongoDB disconnected');
});

module.exports = db;