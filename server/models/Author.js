const mongoose = require('mongoose');
const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
});
module.exports = mongoose.model('Author', AuthorSchema);
