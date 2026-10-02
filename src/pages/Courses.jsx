import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="card wide">
      <h2>Course Details</h2>
      {error && <div className="message error">{error}</div>}
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table>
          <thead>
            <tr><th>Code</th><th>Course Name</th><th>Duration (Years)</th><th>Total Fee</th></tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.durationYears}</td>
                <td>Rs. {parseFloat(c.fee).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
