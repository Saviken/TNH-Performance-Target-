
import { useEffect, useState } from 'react';
import '../styles.css';

const Security = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/posts/security/')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Security posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>Security</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>CRITERIA</th>
              <th>Unit of Measure</th>
              <th>Weight</th>
              <th>Status Yr 2024</th>
              <th>Annual Target</th>
              <th>Cummulative target</th>
              <th>Cummulative Actual</th>
              <th>Statistical explanation of the performance</th>
              <th>Factors contributing to the performance</th>
              <th>Raw Score</th>
              <th>Wtd Score (R. Importance)</th>
              <th>Wtd achiev. of annual target</th>
              <th>Rank</th>
              <th>Status of Activities</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="14" style={{ textAlign: 'center', padding: '24px' }}>No Data Posted.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.criteria}</td>
                  <td>{post.unit_of_measure}</td>
                  <td>{post.weight}</td>
                  <td>{post.status_yr_2024}</td>
                  <td>{post.annual_target}</td>
                  <td>{post.cummulative_target}</td>
                  <td>{post.cummulative_actual}</td>
                  <td>{post.statistical_explanation}</td>
                  <td>{post.factors_contributing}</td>
                  <td>{post.raw_score}</td>
                  <td>{post.wtd_score}</td>
                  <td>{post.wtd_achievement}</td>
                  <td>{post.rank}</td>
                  <td>{post.status_of_activities}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Security;
