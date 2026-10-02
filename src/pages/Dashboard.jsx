import { useState } from 'react';
import api from '../api/client.js';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState(null);
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setError('');
    setStudent(null);
    setFees(null);
    setMarks([]);
    if (!query.trim()) {
      setError('Please enter a student ID or name to search.');
      return;
    }
    setLoading(true);
    try {
      // 1. Find the student via search
      const searchRes = await api.get('/students/search', { params: { q: query } });
      const found = searchRes.data.data;
      if (found.length === 0) {
        setError('No student found. Please check the ID or name.');
        setLoading(false);
        return;
      }
      const sid = found[0].id;

      // 2. Load details, fees and marks in parallel
      const [detailRes, feeRes, marksRes] = await Promise.all([
        api.get('/students/' + sid),
        api.get('/fees/student/' + sid),
        api.get('/marks/student/' + sid),
      ]);
      setStudent(detailRes.data.data);
      setFees(feeRes.data.data);
      setMarks(marksRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card wide">
      <h2>Student Dashboard</h2>
      <form className="search-bar" onSubmit={search}>
        <input
          type="text"
          placeholder="Search by student ID, name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn small" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="message error">{error}</div>}

      {student && (
        <>
          <div className="section">
            <div className="student-header">
              <h3>Student Details</h3>
              <span className="badge">{student.courseCode}</span>
            </div>
            <table>
              <tbody>
                <tr><th>ID</th><td>{student.id}</td></tr>
                <tr><th>Name</th><td>{student.name}</td></tr>
                <tr><th>Email</th><td>{student.email}</td></tr>
                <tr><th>Course</th><td>{student.courseName}</td></tr>
                <tr><th>Semester</th><td>{student.semester}</td></tr>
                <tr><th>Admission Date</th><td>{student.admissionDate?.slice(0, 10)}</td></tr>
              </tbody>
            </table>
          </div>

          {fees && (
            <div className="section">
              <h3>Fee Details</h3>
              <div className="stats">
                <div className="stat-box">
                  <div className="label">Total Fee</div>
                  <div className="value">Rs. {fees.totalFee.toLocaleString()}</div>
                </div>
                <div className="stat-box green">
                  <div className="label">Fee Paid</div>
                  <div className="value">Rs. {fees.totalPaid.toLocaleString()}</div>
                </div>
                <div className="stat-box orange">
                  <div className="label">Balance Due</div>
                  <div className="value">Rs. {fees.balanceDue.toLocaleString()}</div>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Date</th><th>Amount Paid</th><th>Remarks</th></tr>
                </thead>
                <tbody>
                  {fees.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.paymentDate?.slice(0, 10)}</td>
                      <td>Rs. {parseFloat(p.amountPaid).toLocaleString()}</td>
                      <td>{p.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="section">
            <h3>Marks Details</h3>
            {marks.length === 0 ? (
              <p>No marks records found for this student.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Subject</th><th>Internal Marks</th><th>External Marks</th><th>Total</th><th>Exam</th></tr>
                </thead>
                <tbody>
                  {marks.map((m) => (
                    <tr key={m.id}>
                      <td>{m.subject}</td>
                      <td>{m.internalMarks}</td>
                      <td>{m.externalMarks}</td>
                      <td>{parseFloat(m.internalMarks) + parseFloat(m.externalMarks)}</td>
                      <td>{m.examType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
