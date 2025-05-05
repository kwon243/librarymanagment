// src/BookDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
        const matchedBook = res.data.find((b) => b._id === id);
        setBook(matchedBook);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <div>Loading book details...</div>;

  return (
    <div>
      <h2>Book Details</h2>
      <p><strong>Title:</strong> {book.title}</p>
      <p><strong>Author:</strong> {book.author?.name}</p>
      <p><strong>Genre:</strong> {book.genre?.name}</p>
      <p><strong>Publication Date:</strong> {book.publication_date ? new Date(book.publication_date).toLocaleDateString() : 'N/A'}</p>
      <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
      <p><strong>Summary:</strong> {book.summary || 'N/A'}</p>
    </div>
  );
}

export default BookDetail;
