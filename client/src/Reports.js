import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportBooks, setReportBooks] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const authorsRes = await axios.get('http://localhost:5000/authors');
        setAuthors(authorsRes.data);
        const genresRes = await axios.get('http://localhost:5000/genres');
        setGenres(genresRes.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchFilters();
  }, []);

  const handleAuthorsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedAuthors(selectedOptions);
  };

  const handleGenresChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedGenres(selectedOptions);
  };

  const handleReport = async () => {
    try {
      const params = {};
      if (selectedAuthors.length > 0) {
        params.authorIds = selectedAuthors.join(',');
      }
      if (selectedGenres.length > 0) {
        params.genreIds = selectedGenres.join(',');
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:5000/reports/books?${queryString}`);
      setReportBooks(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <h2>Generate Books Report</h2>

      <div>
        <label>Filter by Authors (hold Ctrl/Cmd to select multiple):</label><br />
        <select multiple value={selectedAuthors} onChange={handleAuthorsChange}>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filter by Genres (hold Ctrl/Cmd to select multiple):</label><br />
        <select multiple value={selectedGenres} onChange={handleGenresChange}>
          {genres.map((genre) => (
            <option key={genre._id} value={genre._id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Start Publication Date:</label><br />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div>
        <label>End Publication Date:</label><br />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <br />
      <button onClick={handleReport}>Generate Report</button>

      {reportBooks.length > 0 && (
        <div>
          <h3>Report Results</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Publication Date</th>
              </tr>
            </thead>
            <tbody>
              {reportBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author?.name || 'N/A'}</td>
                  <td>{book.genre?.name || 'N/A'}</td>
                  <td>{book.publication_date ? new Date(book.publication_date).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;
