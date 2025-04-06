const mongoose = require('mongoose');

// 经历事件模式
const ExperienceSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// 人物模式
const PersonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  birthYear: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  brief: {
    type: String,
    required: false
  },
  experiences: [ExperienceSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Person', PersonSchema); 