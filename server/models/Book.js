const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true, index: true }, // Type 1 Indexes
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true, index: true },
  publication_date: { type: Date, index: true },
  isbn: String,
  summary: String
});

// Type 2 Index
BookSchema.index({ author: 1, genre: 1, publication_date: 1 });

module.exports = mongoose.model('Book', BookSchema);
