import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Applied');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch Jobs
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setJobs(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering ? { name, email, password } : { email, password };

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setJobs([]);
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/jobs`,
        { company, position, salary, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs([res.data, ...jobs]);
      setCompany('');
      setPosition('');
      setSalary('');
    } catch (err) {
      alert('Failed to add job application');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${API_URL}/jobs/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((j) => (j._id === id ? res.data : j)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  // Analytics
  const totalApps = jobs.length;
  const interviewing = jobs.filter((j) => j.status === 'Interviewing').length;
  const offers = jobs.filter((j) => j.status === 'Offered').length;
  const responseRate = totalApps
    ? Math.round(((interviewing + offers) / totalApps) * 100)
    : 0;

  const filteredJobs =
    filterStatus === 'All'
      ? jobs
      : jobs.filter((j) => j.status === filterStatus);

  if (!token) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? 'Register Account' : 'Login to Job Tracker'}</h2>
        <form onSubmit={handleAuth}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? 'Sign Up' : 'Login'}</button>
        </form>
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Job Application Tracker</h1>
        <div>
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Analytics Dashboard */}
      <div className="analytics-grid">
        <div className="card"><h3>Total Applications</h3><p>{totalApps}</p></div>
        <div className="card"><h3>Interviewing</h3><p>{interviewing}</p></div>
        <div className="card"><h3>Offers Received</h3><p>{offers}</p></div>
        <div className="card"><h3>Response Rate</h3><p>{responseRate}%</p></div>
      </div>

      {/* Add Job Form */}
      <section className="form-section">
        <h2>Add New Job Application</h2>
        <form onSubmit={handleAddJob} className="job-form">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Role / Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Salary (e.g. $85,000)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="submit">Add Job</button>
        </form>
      </section>

      {/* Job List & Filtering */}
      <section className="list-section">
        <div className="list-header">
          <h2>Application Logs</h2>
          <div>
            <label>Filter Status: </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <table className="jobs-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="5">No job applications found.</td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id}>
                  <td><strong>{job.company}</strong></td>
                  <td>{job.position}</td>
                  <td>{job.salary || 'N/A'}</td>
                  <td>
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`status-badge status-${job.status.toLowerCase()}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
