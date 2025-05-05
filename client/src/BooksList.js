import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BooksList = ({ onEdit, refreshFlag }) => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`); // 'http://localhost:5000/books'
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{
          margin: '0 auto',
          borderCollapse: 'collapse',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author?.name || 'N/A'}</td>
              <td>{book.genre?.name || 'N/A'}</td>
              <td>
                {book.publication_date
                  ? new Date(book.publication_date).toLocaleDateString()
                  : ''}
              </td>
              <td>
                <button onClick={() => onEdit(book)}>Edit</button>{' '}
                <button onClick={() => handleDelete(book._id)}>Delete</button>{' '}
                <Link to={`/books/${book._id}`}>
                  <button>Detailed</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksList;
