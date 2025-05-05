// src/BookForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookForm = ({ bookToEdit, onSuccess, onCancel }) => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
    isbn: '',
    summary: ''
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  // State for new author and new genre fields
  const [newAuthor, setNewAuthor] = useState({ name: '', bio: '' });
  const [newGenre, setNewGenre] = useState({ name: '', description: '' });

  // Get authors and genres for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsRes = await axios.get(`${process.env.REACT_APP_API_URL}/authors`);
        setAuthors(authorsRes.data);
        const genresRes = await axios.get(`${process.env.REACT_APP_API_URL}/genres`);
        setGenres(genresRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Pre-fill fields when editing
  useEffect(() => {
    if (bookToEdit) {
      setBook({
        title: bookToEdit.title,
        author: bookToEdit.author._id,
        genre: bookToEdit.genre._id,
        publication_date: bookToEdit.publication_date
          ? new Date(bookToEdit.publication_date).toISOString().substr(0, 10)
          : '',
        isbn: bookToEdit.isbn || '',
        summary: bookToEdit.summary || ''
      });
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let authorId = book.author;
      if (book.author === 'new') {
        // Create new author
        const authorResponse = await axios.post(`${process.env.REACT_APP_API_URL}/authors`, newAuthor);
        authorId = authorResponse.data._id;
      }

      let genreId = book.genre;
      if (book.genre === 'new') {
        // Create new genre
        const genreResponse = await axios.post(`${process.env.REACT_APP_API_URL}/genres`, newGenre);
        genreId = genreResponse.data._id;
      }

      const bookData = { ...book, author: authorId, genre: genreId };

      if (bookToEdit) {
        // Update existing book
        await axios.put(`${process.env.REACT_APP_API_URL}/books/${bookToEdit._id}`, bookData);
      } else {
        // Add new book
        await axios.post(`${process.env.REACT_APP_API_URL}/books`, bookData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <div>
      <h2>{bookToEdit ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Book Title */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author Selection */}
        <div>
          <label>Author:</label>
          <select name="author" value={book.author} onChange={handleChange} required>
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.name}
              </option>
            ))}
            <option value="new">Add New Author</option>
          </select>
        </div>

        {/* New Author Details */}
        {book.author === 'new' && (
          <div>
            <h4>New Author Details:</h4>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Bio:</label>
              <textarea
                value={newAuthor.bio}
                onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Genre Selection */}
        <div>
          <label>Genre:</label>
          <select name="genre" value={book.genre} onChange={handleChange} required>
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
            <option value="new">Add New Genre</option>
          </select>
        </div>

        {/* New Genre Details */}
        {book.genre === 'new' && (
          <div>
            <h4>New Genre Details:</h4>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={newGenre.description}
                onChange={(e) => setNewGenre({ ...newGenre, description: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Publication Date */}
        <div>
          <label>Publication Date:</label>
          <input
            type="date"
            name="publication_date"
            value={book.publication_date}
            onChange={handleChange}
          />
        </div>

        {/* ISBN */}
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
          />
        </div>

        {/* Summary */}
        <div>
          <label>Summary:</label>
          <textarea
            name="summary"
            value={book.summary}
            onChange={handleChange}
          />
        </div>

        <button type="submit">{bookToEdit ? 'Update' : 'Add'} Book</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default BookForm;
