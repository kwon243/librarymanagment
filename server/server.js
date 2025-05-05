const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models
const Book = require('./models/Book');
const Author = require('./models/Author');
const Genre = require('./models/Genre');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes for Authors
app.get('/authors', async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});
app.post('/authors', async (req, res) => {
  const author = new Author(req.body);
  await author.save();
  res.json(author);
});
// TODO: Add PUT and DELETE endpoints for Author

// Routes for Genres
app.get('/genres', async (req, res) => {
  const genres = await Genre.find();
  res.json(genres);
});
app.post('/genres', async (req, res) => {
  const genre = new Genre(req.body);
  await genre.save();
  res.json(genre);
});
// TODO: Add PUT and DELETE endpoints for Genre

// Routes for Books
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author').populate('genre');
  res.json(books);
});
app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// Update a book (ORM)
app.put('/books/:id', async (req, res) => {
    try {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a book (ORM)
  app.delete('/books/:id', async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Generate book report (prepared statements)
  app.get('/reports/books', async (req, res) => {
    try {
      const { startDate, endDate, authorIds, genreIds } = req.query;
      const filter = {};
  
      // Filter by publication_date range
      if (startDate || endDate) {
        filter.publication_date = {};
        if (startDate) filter.publication_date.$gte = new Date(startDate);
        if (endDate) filter.publication_date.$lte = new Date(endDate);
      }
  
      // Filter by multiple authors
      if (authorIds) {
        const authorsArray = authorIds.split(',').filter(id => id.trim() !== '');
        if (authorsArray.length > 0) {
          filter.author = { $in: authorsArray };
        }
      }
  
      // Filter by multiple genres
      if (genreIds) {
        const genresArray = genreIds.split(',').filter(id => id.trim() !== '');
        if (genresArray.length > 0) {
          filter.genre = { $in: genresArray };
        }
      }
  
      // Execute indexed and populated query
      const books = await Book.find(filter).populate('author').populate('genre');
      res.json(books);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));