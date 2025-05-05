// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';

import BooksList from './BooksList';
import BookForm from './BookForm';
import BookDetail from './BookDetail';
import Reports from './Reports';

function App() {
  const [editingBook, setEditingBook] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (book) => {
    setEditingBook(book);
    navigate('/form');
  };

  const handleSuccess = () => {
    setEditingBook(null);
    setRefreshFlag((prev) => !prev);
    navigate('/');
  };

  const handleAdd = () => {
    setEditingBook(null);
    navigate('/form');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Library Management App</h1>

      {/* Navigation Buttons */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/">
          <button>Books List</button>
        </Link>
        <button onClick={handleAdd} style={{ marginLeft: '1rem' }}>
          Add New Book
        </button>
        <Link to="/report">
          <button style={{ marginLeft: '1rem' }}>Generate Report</button>
        </Link>
      </nav>

      {/* Application Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <BooksList
              onEdit={handleEdit}
              onAdd={handleAdd}
              onReport={() => navigate('/report')}
              refreshFlag={refreshFlag}
            />
          }
        />
        <Route
          path="/form"
          element={
            <BookForm
              bookToEdit={editingBook}
              onSuccess={handleSuccess}
              onCancel={() => navigate('/')}
            />
          }
        />
        <Route path="/report" element={<Reports />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
