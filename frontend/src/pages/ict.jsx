
import { useEffect, useState } from 'react';
import '../styles.css';

const Ict = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/posts/ict/')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ICT posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>ICT</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="modern-table">
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td style={{ textAlign: 'center', padding: '24px' }}>No Data Posted.</td>
              </tr>
            ) : (
              [
                ["Criteria", "criteria"],
                ["Unit of Measure", "unit_of_measure"],
                ["Weight", "weight"],
                ["Status Yr 2024", "status_yr_2024"],
                ["Annual Target", "annual_target"],
                ["Cumulative target", "cummulative_target"],
                ["Cumulative Actual", "cummulative_actual"],
                ["Statistical explanation of the performance", "statistical_explanation"],
                ["Factors contributing to the performance", "factors_contributing"],
                ["Raw Score", "raw_score"],
                ["Wtd Score (R. Importance)", "wtd_score"],
                ["Wtd achiev. of annual target", "wtd_achievement"],
                ["Rank", "rank"],
                ["Status of Activities", "status_of_activities"]
              ].map(([label, key]) => (
                <tr key={key}>
                  <th style={{ textAlign: 'left', width: '280px', background: '#f5f5f5' }}>{label}</th>
                  {posts.map(post => (
                    <td key={post.id + key}>{post[key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Ict;