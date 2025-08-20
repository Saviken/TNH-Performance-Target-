import { useEffect, useState } from 'react';
import '../styles.css';

// File upload component for attachments
function AttachmentUpload({ postId, onCancel }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('attachment', file);
    
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/upload_attachment/`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      // Success - reload to show the uploaded file
      window.location.reload();
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(null);
    setShowUploadForm(false);
    if (onCancel) onCancel();
  };

  const handleAddAttachment = () => {
    setShowUploadForm(true);
  };

  if (!showUploadForm) {
    return (
      <div className="attachment-add-section">
        <button onClick={handleAddAttachment} className="attachment-add-button">
          📎 Add Attachment
        </button>
      </div>
    );
  }

  return (
    <div className="attachment-upload-container">
      <div className="attachment-upload-header">
        <h4>📎 Upload Document</h4>
        <p>Supported formats: PDF, Word, JPEG, PNG</p>
      </div>
      
      <form onSubmit={handleSubmit} className="attachment-upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpeg,.jpg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
            onChange={handleFileChange}
            disabled={uploading}
            className="attachment-file-input"
            id={`file-input-${postId}`}
          />
          <label htmlFor={`file-input-${postId}`} className="file-input-label">
            {file ? file.name : 'Choose file...'}
          </label>
        </div>
        
        {file && (
          <div className="file-info">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
        )}
        
        {error && <div className="attachment-upload-error">{error}</div>}
        
        <div className="attachment-upload-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="attachment-cancel-button"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !file}
            className="attachment-submit-button"
          >
            {uploading ? (
              <>
                <span className="loading-spinner"></span>
                Uploading...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const Operation = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [openCriteria, setOpenCriteria] = useState({});
  const [stats, setStats] = useState({ totalPosts: 0, totalSubtitles: 0, totalCriteria: 0 });
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch posts
    fetch('http://localhost:8000/api/posts/operations/')
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Operations API Response:', responseData);
        
        if (responseData.success && responseData.data) {
          // Ensure all data values are properly serialized
          const sanitizedData = {};
          Object.entries(responseData.data).forEach(([subtitleName, criteriaData]) => {
            sanitizedData[String(subtitleName)] = {};
            Object.entries(criteriaData).forEach(([criteriaName, posts]) => {
              sanitizedData[String(subtitleName)][String(criteriaName)] = posts.map(post => ({
                ...post,
                id: post.id ? String(post.id) : undefined,
                unit_of_measure: post.unit_of_measure ? String(post.unit_of_measure) : '',
                cummulative_target: post.cummulative_target ? String(post.cummulative_target) : '',
                statistical_explanation: post.statistical_explanation ? String(post.statistical_explanation) : '',
                factors_contributing: post.factors_contributing ? String(post.factors_contributing) : '',
                status_of_activities: post.status_of_activities ? String(post.status_of_activities) : '',
                raw_score: post.raw_score ? String(post.raw_score) : '',
                wtd_score: post.wtd_score ? String(post.wtd_score) : '',
                wtd_achievement: post.wtd_achievement ? String(post.wtd_achievement) : '',
                rank: post.rank ? String(post.rank) : ''
              }));
            });
          });
          setData(sanitizedData);
          // Calculate stats
          const totalSubtitles = Object.keys(responseData.data).length;
          let totalCriteria = 0;
          let totalPosts = 0;
          Object.values(responseData.data).forEach(subtitle => {
            totalCriteria += Object.keys(subtitle).length;
            Object.values(subtitle).forEach(criteria => {
              totalPosts += criteria.length;
            });
          });
          setStats({ totalPosts, totalSubtitles, totalCriteria });
        } else if (responseData.sample_posts) {
          // Fallback to old format for debugging
          const grouped = {};
          responseData.sample_posts.forEach(post => {
            const subtitleName = post.subtitle || 'General';
            const criteriaName = post.criteria || 'No Criteria';
            if (!grouped[subtitleName]) grouped[subtitleName] = {};
            if (!grouped[subtitleName][criteriaName]) grouped[subtitleName][criteriaName] = [];
            grouped[subtitleName][criteriaName].push(post);
          });
          setData(grouped);
          console.log('Debug info:', responseData);
        } else {
          console.log('No operations data found. Response:', responseData);
          setData({});
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching Operations posts:', error);
        setLoading(false);
      });
  }, []);

  const handleToggleAll = () => {
    const allOpen = Object.keys(data).every(subtitle => openSections[String(subtitle)]);
    const newState = {};
    Object.keys(data).forEach(subtitle => {
      newState[String(subtitle)] = !allOpen;
    });
    setOpenSections(newState);
  };

  const handleToggleSubtitle = (subtitleName) => {
    const key = String(subtitleName);
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleCriteria = (subtitleName, criteriaName) => {
    const key = `${String(subtitleName)}-${String(criteriaName)}`;
    setOpenCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditFormData({
      cummulative_target: post.cummulative_target || '',
      statistical_explanation: post.statistical_explanation || '',
      factors_contributing: post.factors_contributing || '',
      status_of_activities: post.status_of_activities || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitEdit = async (postId) => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="medical-main">
      <div className="medical-header">
        <h1 className="medical-title">Operations Division</h1>
        <button
          onClick={handleToggleAll}
          className="medical-toggle-all-custom"
        >
          {Object.keys(data).every(subtitle => openSections[String(subtitle)]) ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      
      {/* Statistics Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPosts}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalSubtitles}</div>
          <div className="stat-label">Subtitles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCriteria}</div>
          <div className="stat-label">Criteria</div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading operations data...</div>
      ) : (
        <div className="medical-sections">
          {Object.keys(data).length === 0 ? (
            <div className="medical-post-empty">
              <div className="empty-state-icon">⚙️</div>
              <div>No operations data available</div>
            </div>
          ) : (
            Object.entries(data).map(([subtitleName, criteriaData]) => (
              <div key={String(subtitleName)} className={`medical-section ${openSections[String(subtitleName)] ? 'expanded' : ''}`}>
                <div
                  className="medical-section-header"
                  onClick={() => handleToggleSubtitle(String(subtitleName))}
                >
                  <span className="medical-section-title ms-heading-title">{String(subtitleName)}</span>
                  <span className="medical-section-icon">{openSections[String(subtitleName)] ? '−' : '+'}</span>
                </div>
                {openSections[String(subtitleName)] && (
                  <div className="medical-posts">
                    {Object.entries(criteriaData).map(([criteriaName, posts]) => (
                      <div key={String(criteriaName)} className="criteria-group">
                        <div
                          className="criteria-header"
                          onClick={() => handleToggleCriteria(String(subtitleName), String(criteriaName))}
                        >
                          <span className="ms-heading-subtitle">🎯 {String(criteriaName)} ({Array.isArray(posts) ? posts.length : 0} posts)</span>
                          <span className="medical-section-icon">
                            {openCriteria[`${String(subtitleName)}-${String(criteriaName)}`] ? '−' : '+'}
                          </span>
                        </div>
                        {openCriteria[`${String(subtitleName)}-${String(criteriaName)}`] && (
                          <div className="criteria-posts">
                            {Array.isArray(posts) && posts.map((post, index) => {
                              // Ensure post is a valid object
                              if (!post || typeof post !== 'object') {
                                console.warn('Invalid post data:', post);
                                return null;
                              }
                              
                              return (
                              <div key={post.id || index} className="medical-post">
                                <div className="post-content">
                                  <div className="post-field">
                                    <span className="field-label">Unit of Measure</span>
                                    <span className={`field-value ${!post.unit_of_measure ? 'empty' : ''}`}>
                                      {String(post.unit_of_measure || 'Not specified')}
                                    </span>
                                  </div>
                                  
                                  <div className="post-field">
                                    <span className="field-label">Cumulative Target</span>
                                    {editingPost === post.id ? (
                                      <div className="field-edit-container">
                                        <input
                                          type="text"
                                          value={editFormData.cummulative_target || ''}
                                          onChange={(e) => handleInputChange('cummulative_target', e.target.value)}
                                          className="field-edit-input"
                                          placeholder="Enter cumulative target"
                                        />
                                      </div>
                                    ) : (
                                      <span className={`field-value ${!post.cummulative_target ? 'empty' : ''}`}>
                                        {String(post.cummulative_target || 'Not set')}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="post-field">
                                    <span className="field-label">Statistical Explanation</span>
                                    {editingPost === post.id ? (
                                      <div className="field-edit-container">
                                        <textarea
                                          value={editFormData.statistical_explanation || ''}
                                          onChange={(e) => handleInputChange('statistical_explanation', e.target.value)}
                                          className="field-edit-textarea"
                                          placeholder="Enter statistical explanation"
                                          rows="3"
                                        />
                                      </div>
                                    ) : (
                                      <span className={`field-value ${!post.statistical_explanation ? 'empty' : ''}`}>
                                        {String(post.statistical_explanation || 'No explanation provided')}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="post-field">
                                    <span className="field-label">Contributing Factors</span>
                                    {editingPost === post.id ? (
                                      <div className="field-edit-container">
                                        <textarea
                                          value={editFormData.factors_contributing || ''}
                                          onChange={(e) => handleInputChange('factors_contributing', e.target.value)}
                                          className="field-edit-textarea"
                                          placeholder="Enter contributing factors"
                                          rows="3"
                                        />
                                      </div>
                                    ) : (
                                      <span className={`field-value ${!post.factors_contributing ? 'empty' : ''}`}>
                                        {String(post.factors_contributing || 'No factors listed')}
                                      </span>
                                    )}
                                  </div>

                                  <div className="post-field">
                                    <span className="field-label">Status of Activities</span>
                                    {editingPost === post.id ? (
                                      <div className="field-edit-container">
                                        <textarea
                                          value={editFormData.status_of_activities || ''}
                                          onChange={(e) => handleInputChange('status_of_activities', e.target.value)}
                                          className="field-edit-textarea"
                                          placeholder="Enter status of activities"
                                          rows="3"
                                        />
                                      </div>
                                    ) : (
                                      <span className={`field-value ${!post.status_of_activities ? 'empty' : ''}`}>
                                        {String(post.status_of_activities || 'No status provided')}
                                      </span>
                                    )}
                                  </div>

                                  {/* Performance Metrics */}
                                  <div className="post-metrics">
                                    <div className="metric-item">
                                      <div className="metric-label">Raw Score</div>
                                      <div className="metric-value">{String(post.raw_score || 'N/A')}</div>
                                    </div>
                                    <div className="metric-item">
                                      <div className="metric-label">Weighted Score</div>
                                      <div className="metric-value">{String(post.wtd_score || 'N/A')}</div>
                                    </div>
                                    <div className="metric-item">
                                      <div className="metric-label">Achievement</div>
                                      <div className="metric-value">{String(post.wtd_achievement || 'N/A')}</div>
                                    </div>
                                    <div className="metric-item">
                                      <div className="metric-label">Rank</div>
                                      <div className="metric-value">{String(post.rank || 'N/A')}</div>
                                    </div>
                                  </div>

                                  {/* Edit/Submit/Cancel Buttons */}
                                  <div className="post-actions">
                                    {editingPost === post.id ? (
                                      <div className="edit-actions">
                                        <button
                                          onClick={handleCancelEdit}
                                          className="cancel-edit-button"
                                          disabled={saving}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleSubmitEdit(post.id)}
                                          className="submit-edit-button"
                                          disabled={saving}
                                        >
                                          {saving ? (
                                            <>
                                              <span className="loading-spinner"></span>
                                              Saving...
                                            </>
                                          ) : (
                                            'Submit'
                                          )}
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => handleEditPost(post)}
                                        className="edit-post-button"
                                      >
                                        ✏️ Edit Post
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Attachment Section */}
                                <div className="attachment-section">
                                  {post.attachment ? (
                                    <div className="attachment-existing">
                                      <div className="attachment-info">
                                        <span className="attachment-icon">📄</span>
                                        <div className="attachment-details">
                                          <div className="attachment-label">Document Attached</div>
                                          <a 
                                            href={post.attachment} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="attachment-link"
                                          >
                                            View Document
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <AttachmentUpload postId={post.id} />
                                  )}
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default Operation;