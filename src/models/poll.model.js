const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500      
    },
    answers: [{
      answer: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 500      
      },
      voteCount: {
        type: Number,
        min: 0,
        default: 0
      }
    }]
  }],
  isPublished: {
    type: Boolean,
    required: true,
    default: false
  },
  selectedPageType: {
    type: String,
    required: true,
    default: 'home'
  },
  selectedId: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Poll', pollSchema);