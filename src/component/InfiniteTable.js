import React, { useState, useEffect, useRef } from 'react';

const InfiniteScrollTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);  // Current page or offset for API request
  const tableRef = useRef(null);  // To refer to the table's container

  // Mock API call using JSONPlaceholder
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`);
      const result = await response.json();
      setData(prevData => [...prevData, ...result]);  // Append new data to existing data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll event listener
  const handleScroll = () => {
    if (tableRef.current) {
      const bottom = tableRef.current.scrollHeight === tableRef.current.scrollTop + tableRef.current.clientHeight;
      if (bottom && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  // Fetch initial data and handle page change
  useEffect(() => {
    fetchData();
  }, [page]);

  // Attach scroll event listener
  useEffect(() => {
    const tableContainer = tableRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  return (
    <div style={{ height: '200px', overflowY: 'auto' }} ref={tableRef}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default InfiniteScrollTable;
