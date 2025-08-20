import { useEffect, useRef, useState, useMemo } from 'react';
import '../styles.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PERMISSIONS } from '../utils/permissions.js';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import axios from 'axios';

function MedicalServices() {
  // Helper functions for rank colors and labels  
  const getRankColor = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return '#6b7280';
    // Updated scoring system: 1.00-2.40 = Excellent, etc.
    if (num >= 1.00 && num <= 2.40) return '#4caf50'; // Excellent - Green
    if (num > 2.40 && num <= 3.00) return '#2196f3'; // Very Good - Blue  
    if (num > 3.00 && num <= 3.60) return '#009688'; // Good - Teal
    if (num > 3.60 && num <= 4.00) return '#ff9800'; // Fair - Orange
    if (num > 4.00 && num <= 5.00) return '#f44336'; // Poor - Red
    return '#6b7280'; // Default gray
  };

  const getRankLabel = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return '';
    if (num >= 1.00 && num <= 2.40) return 'Excellent';
    if (num > 2.40 && num <= 3.00) return 'Very Good';
    if (num > 3.00 && num <= 3.60) return 'Good';
    if (num > 3.60 && num <= 4.00) return 'Fair';
    if (num > 4.00 && num <= 5.00) return 'Poor';
    return '';
  };

  const { 
    logout, 
    user,
    hasPermission,
    canViewBranch,
    getUserPermissions,
    isAuthenticated
  } = useAuth();
  const [data, setData] = useState({}); // { subtitle: { criteria: [objectives] } }
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [openTable, setOpenTable] = useState({ subtitle: null, criteria: null });
  const [unitOfMeasureChanges, setUnitOfMeasureChanges] = useState({}); // { [objectiveId]: { unit_of_measure } }
  const [performanceChanges, setPerformanceChanges] = useState({}); // { [objectiveId]: { cumulative_actual, explanation, contributing_factors, evidence_file } }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rejectingObjective, setRejectingObjective] = useState(null); // {id, type: 'unit' | 'performance'}
  const [rejectionComment, setRejectionComment] = useState('');
  const subtitleRefs = useRef({});

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentQuarter = useMemo(() => Math.floor(new Date().getMonth() / 3) + 1, []);

  const fetchObjectives = () => {
    console.log('Fetching objectives...');
    console.log('User branch:', user?.branch);
    console.log('Can view own branch only:', canViewOwnBranchOnly);
    
    fetch('http://localhost:8000/api/objectives/')
      .then(r => r.json())
      .then(fetched => {
        console.log('Raw API response:', fetched);
        
        // fetched is expected to be a flat list from DRF
        let grouped = {};
        if (Array.isArray(fetched)) {
          console.log('Data is array, length:', fetched.length);
          
          // Filter data for Head of Department to only show their branch
          let filteredData = fetched;
          if (canViewOwnBranchOnly && user?.branch) {
            console.log('Filtering data for branch:', user.branch);
            filteredData = fetched.filter(obj => obj.branch === user.branch);
            console.log('Filtered data length:', filteredData.length);
          }
          
          console.log('Processing filtered data:', filteredData);
          
          filteredData.forEach(obj => {
            const subtitleName = obj.subtitle || 'Unspecified Subtitle';
            const criteriaName = obj.criteria || 'Unspecified Criteria';
            if (!grouped[subtitleName]) grouped[subtitleName] = {};
            if (!grouped[subtitleName][criteriaName]) grouped[subtitleName][criteriaName] = [];
            
            // Determine the workflow stage based on status and data completeness
            let workflowStage = 'unit_of_measure'; // Default to first stage
            if (obj.unit_of_measure && obj.unit_of_measure_status === 'APPROVED') {
              workflowStage = 'performance_target';
            } else if (obj.unit_of_measure && obj.unit_of_measure_status === 'PENDING') {
              workflowStage = 'unit_pending';
            } else if (obj.unit_of_measure && obj.unit_of_measure_status === 'REJECTED') {
              workflowStage = 'unit_rejected';
            }
            
            grouped[subtitleName][criteriaName].push({
              id: obj.id,
              unit_of_measure: obj.unit_of_measure,
              unit_of_measure_status: obj.unit_of_measure_status || 'DRAFT',
              weight: obj.weight,
              annual_target: obj.annual_target,
              description: obj.description,
              status: obj.status,
              rejection_comment: obj.rejection_comment,
              workflowStage: workflowStage,
              quarters: obj.quarters || [],
            });
          });
        } else {
          console.log('API response is not an array:', fetched);
        }
        
        console.log('Final grouped data:', grouped);
        setData(grouped);
        const openAll = Object.keys(grouped).reduce((acc, k) => { acc[k] = true; return acc; }, {});
        setOpenSections(openAll);
        setLoading(false);
      })
      .catch(error => { 
        console.error('Error fetching objectives:', error);
        setData({}); 
        setLoading(false); 
      });
  };

  useEffect(() => { fetchObjectives(); }, []);

  const handleToggleSubtitle = (subtitleName) => {
    setOpenSections(prev => ({ ...prev, [subtitleName]: !prev[subtitleName] }));
  };

  const handleExpandAll = () => {
    const openAll = Object.keys(data).reduce((acc, k) => { acc[k] = true; return acc; }, {});
    setOpenSections(openAll);
  };

  const handleCollapseAll = () => {
    const closeAll = Object.keys(data).reduce((acc, k) => { acc[k] = false; return acc; }, {});
    setOpenSections(closeAll);
  };

  // subtitle index jump removed

  return (
    <main className="analytics-main">
      <div className="analytics-container">
        <div className="analytics-card" style={{ width: '100%' }}>
          <div className="analytics-header">
            <h2>Medical Services Dashboard</h2>
            <Button variant="outlined" onClick={logout} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>Logout</Button>
          </div>

          {/* Strategy/Criteria Form - Only for Instructor and Admin */}
          {hasPermission(PERMISSIONS.CREATE_STRATEGIC_OBJECTIVE) && (
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <h2 style={{ marginBottom: 16 }}>Performance Target Form</h2>
              <form onSubmit={handleFormSubmit}>
                <Stack spacing={2}>
                  <Box>
                    <label style={{ fontWeight: 500 }}>Branch</label>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      name="branch"
                      value={form.branch}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </TextField>
                  </Box>
                  <Box>
                    <label style={{ fontWeight: 500 }}>Strategy</label>
                    <TextField
                      name="strategy"
                      value={form.strategy}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <label style={{ fontWeight: 500 }}>Criteria</label>
                    <TextField
                      name="criteria"
                      value={form.criteria}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      multiline
                      minRows={2}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Button type="submit" variant="contained" disabled={formLoading}>
                    {formLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          )}
          {/* Sticky controls + index */}
          {(
            <div className="ms-sticky">
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                className="ms-toolbar ms-inline-scroll"
              >
                <Box sx={{ flexGrow: 1 }} />
                {/* Stats */}
                {(() => {
          const subtitleCount = Object.keys(data || {}).length;
          const criteriaCount = Object.values(data || {}).reduce((acc, c) => acc + Object.keys(c).length, 0);
          const objCount = Object.values(data || {}).reduce((acc, c) => acc + Object.values(c).reduce((a, arr) => a + arr.length, 0), 0);
                  return (
                    <Stack direction="row" spacing={1}>
                      <Chip size="small" label={`Subtitles: ${subtitleCount}`} />
                      <Chip size="small" color="primary" label={`Criteria: ${criteriaCount}`} />
            <Chip size="small" color="success" label={`Objectives: ${objCount}`} />
                    </Stack>
                  );
                })()}
                <Button size="small" variant="contained" onClick={handleExpandAll}>Expand all</Button>
                <Button size="small" variant="outlined" onClick={handleCollapseAll}>Collapse all</Button>
              </Stack>
              {/* Subtitle index removed as requested */}
            </div>
          )}
          <div className="objectives-list">
            {loading ? (
              <div style={{ padding: 16 }}>
                <Skeleton height={36} width={300} />
                <Skeleton height={20} width={240} />
                <Skeleton height={140} sx={{ mt: 1 }} />
              </div>
            ) : (
              Object.entries(data).map(([subtitleName, criteriaData], idx) => (
                <div key={subtitleName} className="objective-item" ref={el => { subtitleRefs.current[subtitleName] = el; }} style={{ overflowX: 'hidden' }}>
                  <div className="objective-header" onClick={() => handleToggleSubtitle(subtitleName)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <h4 className="objective-title ms-heading-title" style={{ margin: 0 }}>{idx < 7 ? `${idx + 1}. ` : ''}{subtitleName}</h4>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {(() => {
                        const allPosts = Object.values(criteriaData).reduce((a, arr) => a.concat(arr), []);
                        const nums = allPosts.map(p => parseFloat(p.raw_score)).filter(v => Number.isFinite(v));
                        const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : null;
                        const avgStr = avg !== null ? avg.toFixed(2) : '—';
                        const color = avg !== null ? getRankColor(avg) : '#9e9e9e';
                        const label = avg !== null ? getRankLabel(avg) : 'No Score';
                        return (
                          <>
                            <Chip size="small" label={`Avg ${avgStr}`} sx={{ backgroundColor: color, color: '#fff' }} />
                            <Chip size="small" label={label} sx={{ backgroundColor: color, color: '#fff' }} />
                          </>
                        );
                      })()}
                      <span className="expand-icon">{openSections[subtitleName] ? '−' : '+'}</span>
                    </Stack>
                  </div>
                  {openSections[subtitleName] && (
                    <div className="criteria-analytics" style={{ display: 'block' }}>
                      {Object.entries(criteriaData).map(([criteriaName, objectives]) => {
                          const nums = objectives
                            .map(o => parseFloat(o.raw_score))
                            .filter(v => Number.isFinite(v));
                          const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : null;
                          const avgStr = avg !== null ? avg.toFixed(2) : '—';
                          const color = avg !== null ? getRankColor(avg) : '#9e9e9e';
                          const label = avg !== null ? getRankLabel(avg) : 'No Score';
                          return (
                            <div
                              key={criteriaName}
                              onClick={() => setOpenTable({ subtitle: subtitleName, criteria: criteriaName })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 12px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer'
                              }}
                            >
                              <span className="ms-heading-subtitle">{criteriaName}</span>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip size="small" label={`Avg ${avgStr}`} sx={{ backgroundColor: color, color: '#fff' }} />
                                <Chip size="small" label={label} sx={{ backgroundColor: color, color: '#fff' }} />
                                <Chip size="small" color="primary" label={objectives.length} />
                              </Stack>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))
            )}
            {!loading && Object.keys(data).length === 0 && (
              <div style={{ color: '#777', padding: '16px 8px' }}>
                No data found. If you recently added posts, ensure you’re connected to the correct database.
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={!!openTable.subtitle}
        onClose={() => setOpenTable({ subtitle: null, criteria: null })}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: (() => {
              const selected = openTable.subtitle && openTable.criteria ? (data[openTable.subtitle]?.[openTable.criteria] || []) : [];
              const hasApproved = selected.some(o => o.status === 'APPROVED');
              return hasApproved
                ? { height: '95vh', maxHeight: '95vh', display: 'flex' }
                : { maxHeight: '80vh', display: 'block' };
            })()
          }}
      >
        <DialogTitle>
          {(() => {
            const selected = openTable.subtitle && openTable.criteria ? (data[openTable.subtitle]?.[openTable.criteria] || []) : [];
            if (selected.length > 0) {
              const firstObj = selected[0];
              if (firstObj.workflowStage === 'unit_of_measure' || firstObj.workflowStage === 'unit_rejected') {
                return 'Unit of Measure Form';
              } else if (firstObj.workflowStage === 'unit_pending') {
                return 'Unit of Measure (Pending Approval)';
              } else {
                return 'Performance Target Form';
              }
            }
            return 'Form';
          })()}
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: 'auto', pb: 2 }}>
          <Stack spacing={2}>
            {openTable.subtitle && openTable.criteria &&
              (data[openTable.subtitle]?.[openTable.criteria] || []).map((obj, idx) => {
                const workflowStage = obj.workflowStage;
                const isUnitPending = obj.unit_of_measure_status === 'PENDING';
                const isUnitRejected = obj.unit_of_measure_status === 'REJECTED';
                
                return (
                  <Paper key={obj.id || idx} className="ms-form-card" sx={{ position: 'relative' }}>
                    {/* Status banner for pending/rejected states */}
                    {(isUnitPending || isUnitRejected) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        background: isUnitPending ? '#f59e0b' : '#dc2626',
                        color: '#fff',
                        fontSize: 12,
                        padding: '4px 8px',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        textAlign: 'center',
                        letterSpacing: 0.5
                      }}>
                        {isUnitPending ? 'Unit of Measure: Pending Approval' : 'Unit of Measure: Rejected - Resubmit Required'}
                      </div>
                    )}
                    
                    <div className="ms-form-header" style={{ marginTop: (isUnitPending || isUnitRejected) ? '24px' : '0' }}>
                      <h3 className="ms-form-title ms-heading-title" style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                        {openTable.subtitle}
                      </h3>
                      <p className="ms-form-subtitle ms-heading-subtitle" style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                        {openTable.criteria}
                      </p>
                    </div>
                    
                    <div className="ms-form-body" style={{ padding: '0 4px' }}>
                      {/* Always show Strategy and Criteria as read-only */}
                      <div className="ms-form-row" style={{ marginBottom: '16px' }}>
                        <div className="ms-form-label" style={{ fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Strategy</div>
                        <div className="ms-form-value ms-heading-title" style={{ 
                          background: '#f9fafb', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid #e5e7eb',
                          fontSize: '14px'
                        }}>
                          {openTable.subtitle}
                        </div>
                      </div>
                      <div className="ms-form-row" style={{ marginBottom: '20px' }}>
                        <div className="ms-form-label" style={{ fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Criteria</div>
                        <div className="ms-form-value ms-heading-subtitle" style={{ 
                          background: '#f9fafb', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid #e5e7eb',
                          fontSize: '14px'
                        }}>
                          {openTable.criteria}
                        </div>
                      </div>

                      {/* Unit of Measure Form - Stage 1 */}
                      {(workflowStage === 'unit_of_measure' || workflowStage === 'unit_rejected') && (
                        <>
                          <div className="ms-form-row">
                            <div className="ms-form-label" style={{ 
                              fontWeight: '500', 
                              marginBottom: '8px', 
                              color: '#374151',
                              fontSize: '14px'
                            }}>
                              Unit of Measure *
                            </div>
                            <TextField 
                              size="medium" 
                              fullWidth 
                              multiline
                              minRows={4}
                              maxRows={8}
                              value={unitOfMeasureChanges[obj.id]?.unit_of_measure ?? obj.unit_of_measure ?? ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z0-9\s\-.%/()]*$/.test(value) || value === '') {
                                  setUnitOfMeasureChanges(p => ({ ...p, [obj.id]: { unit_of_measure: value } }));
                                }
                              }}
                              placeholder="Define the unit of measurement for this criteria..."
                              helperText="Define a clear, specific unit of measurement that will be used for performance tracking."
                              variant="outlined"
                            />
                          </div>

                          {isUnitRejected && obj.rejection_comment && (
                            <div className="ms-form-row" style={{ marginBottom: '20px' }}>
                              <div className="ms-form-label" style={{ fontWeight: '500', marginBottom: '8px', color: '#dc2626' }}>
                                Rejection Reason
                              </div>
                              <div style={{ 
                                background: '#fef2f2', 
                                border: '1px solid #fecaca', 
                                padding: '12px 16px', 
                                borderRadius: '8px', 
                                color: '#991b1b',
                                fontSize: '14px'
                              }}>
                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                  Administrator Feedback:
                                </div>
                                {obj.rejection_comment}
                              </div>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              disabled={!unitOfMeasureChanges[obj.id]}
                              onClick={() => {
                                setUnitOfMeasureChanges(prev => { 
                                  const clone = { ...prev }; 
                                  delete clone[obj.id]; 
                                  return clone; 
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              disabled={!unitOfMeasureChanges[obj.id]?.unit_of_measure?.trim()}
                              onClick={async () => {
                                try {
                                  const payload = { unit_of_measure: unitOfMeasureChanges[obj.id].unit_of_measure };
                                  await axios.patch(`http://localhost:8000/api/objectives/${obj.id}/`, payload);
                                  await axios.post(`http://localhost:8000/api/objectives/${obj.id}/submit-unit-of-measure/`);
                                  
                                  setUnitOfMeasureChanges(prev => { 
                                    const clone = { ...prev }; 
                                    delete clone[obj.id]; 
                                    return clone; 
                                  });
                                  fetchObjectives();
                                  setSnackbar({ 
                                    open: true, 
                                    message: 'Unit of Measure submitted for approval.', 
                                    severity: 'success' 
                                  });
                                } catch (err) {
                                  console.error(err);
                                  setSnackbar({ 
                                    open: true, 
                                    message: 'Submission failed. Please try again.', 
                                    severity: 'error' 
                                  });
                                }
                              }}
                            >
                              Submit for Approval
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Unit Pending - Stage 1.5 */}
                      {workflowStage === 'unit_pending' && (
                        <>
                          <div style={{ 
                            background: '#fef3c7', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            border: '1px solid #fcd34d',
                            marginBottom: '20px'
                          }}>
                            <div style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#92400e', 
                              marginBottom: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ 
                                width: '20px', 
                                height: '20px', 
                                background: '#f59e0b', 
                                color: '#fff', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '12px', 
                                fontWeight: 'bold' 
                              }}>
                                ⏳
                              </span>
                              Unit of Measure - Pending Administrator Review
                            </div>
                            <div className="ms-form-row">
                              <div className="ms-form-label" style={{ 
                                fontWeight: '500', 
                                marginBottom: '8px', 
                                color: '#92400e',
                                fontSize: '14px'
                              }}>
                                Submitted Unit of Measure
                              </div>
                              <div className="ms-form-value" style={{ 
                                fontStyle: 'normal', 
                                color: '#92400e',
                                background: '#fff',
                                padding: '12px 16px',
                                borderRadius: '6px',
                                border: '1px solid #fcd34d',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}>
                                {obj.unit_of_measure}
                              </div>
                            </div>
                          </div>
                          
                          {/* Admin actions for Unit of Measure approval */}
                          {hasPermission(PERMISSIONS.APPROVE_UNIT_OF_MEASURE) && (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'flex-end', 
                              gap: 12, 
                              marginTop: 20,
                              padding: '16px 0',
                              borderTop: '1px solid #e5e7eb'
                            }}>
                              <Button 
                                size="medium" 
                                variant="contained" 
                                color="success"
                                onClick={async () => {
                                  try {
                                    await axios.post(`http://localhost:8000/api/objectives/${obj.id}/approve-unit-of-measure/`);
                                    fetchObjectives();
                                    setSnackbar({ 
                                      open: true, 
                                      message: 'Unit of Measure approved.', 
                                      severity: 'success' 
                                    });
                                  } catch (err) {
                                    setSnackbar({ 
                                      open: true, 
                                      message: 'Approval failed.', 
                                      severity: 'error' 
                                    });
                                  }
                                }}
                                sx={{
                                  minWidth: '100px',
                                  textTransform: 'none',
                                  fontWeight: '600'
                                }}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="medium" 
                                variant="outlined" 
                                color="error"
                                onClick={() => {
                                  setRejectingObjective({ id: obj.id, type: 'unit' });
                                  setRejectionComment('');
                                }}
                                sx={{
                                  minWidth: '100px',
                                  textTransform: 'none',
                                  fontWeight: '500'
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Performance Target Form - Stage 2 */}
                      {workflowStage === 'performance_target' && (
                        <>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Unit of Measure</div>
                            <div className="ms-form-value">{obj.unit_of_measure || 'N/A'}</div>
                          </div>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Weight</div>
                            <div className="ms-form-value">{obj.weight || 'To be filled by Admin'}</div>
                          </div>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Cumulative Target</div>
                            <div className="ms-form-value">{obj.annual_target || 'To be filled by Admin'}</div>
                          </div>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Cumulative Actual</div>
                            <TextField 
                              size="small" 
                              fullWidth 
                              value={performanceChanges[obj.id]?.cumulative_actual ?? ''}
                              onChange={(e) => setPerformanceChanges(p => ({ 
                                ...p, 
                                [obj.id]: { ...p[obj.id], cumulative_actual: e.target.value } 
                              }))}
                              placeholder="Enter actual performance value"
                            />
                          </div>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Statistical Explanation of the Performance</div>
                            <TextField 
                              size="small" 
                              fullWidth 
                              multiline 
                              minRows={2} 
                              maxRows={4}
                              value={performanceChanges[obj.id]?.explanation ?? ''}
                              onChange={(e) => setPerformanceChanges(p => ({ 
                                ...p, 
                                [obj.id]: { ...p[obj.id], explanation: e.target.value } 
                              }))}
                              placeholder="Provide statistical explanation of the performance"
                            />
                          </div>
                          <div className="ms-form-row">
                            <div className="ms-form-label">Factors Contributing to the Performance</div>
                            <TextField 
                              size="small" 
                              fullWidth 
                              multiline 
                              minRows={2} 
                              maxRows={4}
                              value={performanceChanges[obj.id]?.contributing_factors ?? ''}
                              onChange={(e) => setPerformanceChanges(p => ({ 
                                ...p, 
                                [obj.id]: { ...p[obj.id], contributing_factors: e.target.value } 
                              }))}
                              placeholder="Describe factors that contributed to this performance"
                            />
                          </div>
                          
                          {/* Raw Score - Filled by Admin */}
                          <div className="ms-form-row">
                            <div className="ms-form-label">Raw Score</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ 
                                backgroundColor: getRankColor(obj.raw_score || ''),
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                minWidth: '60px',
                                textAlign: 'center'
                              }}>
                                {obj.raw_score || 'N/A'}
                              </div>
                              <span style={{ fontSize: '12px', color: '#666' }}>
                                (Filled by Admin)
                              </span>
                            </div>
                          </div>
                          
                          {/* Rank - Auto-calculated */}
                          <div className="ms-form-row">
                            <div className="ms-form-label">Rank</div>
                            <div style={{ 
                              backgroundColor: getRankColor(obj.raw_score || ''),
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              display: 'inline-block',
                              minWidth: '100px',
                              textAlign: 'center'
                            }}>
                              {getRankLabel(obj.raw_score || '') || 'N/A'}
                            </div>
                          </div>
                          
                          {/* Evidence Upload */}
                          <div className="ms-form-row">
                            <div className="ms-form-label">Proof of Evidence</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf,.docx,.doc,.ppt,.xlsx"
                                style={{ display: 'none' }}
                                id={`evidence-upload-${obj.id}`}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    if (file.size > 25 * 1024 * 1024) {
                                      setSnackbar({ 
                                        open: true, 
                                        message: 'File size exceeds 25MB limit.', 
                                        severity: 'error' 
                                      });
                                      return;
                                    }
                                    setPerformanceChanges(p => ({ 
                                      ...p, 
                                      [obj.id]: { ...p[obj.id], evidence_file: file } 
                                    }));
                                  }
                                }}
                              />
                              <label htmlFor={`evidence-upload-${obj.id}`}>
                                <Button variant="outlined" component="span" size="small">
                                  Upload Evidence
                                </Button>
                              </label>
                              {performanceChanges[obj.id]?.evidence_file && (
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  Selected: {performanceChanges[obj.id].evidence_file.name}
                                </div>
                              )}
                              <div style={{ fontSize: '11px', color: '#999' }}>
                                Allowed: PNG, JPEG, PDF, DOCX, XLSX (Max 25MB)
                              </div>
                            </div>
                          </div>

                          {/* Performance Form Actions */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              disabled={!performanceChanges[obj.id]}
                              onClick={() => {
                                setPerformanceChanges(prev => { 
                                  const clone = { ...prev }; 
                                  delete clone[obj.id]; 
                                  return clone; 
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              disabled={!performanceChanges[obj.id]?.cumulative_actual?.trim()}
                              onClick={async () => {
                                try {
                                  const payload = performanceChanges[obj.id];
                                  const cleaned = Object.fromEntries(
                                    Object.entries(payload).filter(([k, v]) => k !== 'evidence_file' && v !== '')
                                  );
                                  
                                  // Create quarter record if needed
                                  const createResp = await fetch(`http://localhost:8000/api/objectives/${obj.id}/quarters/`, { 
                                    method: 'POST', 
                                    headers: { 'Content-Type': 'application/json' }, 
                                    body: JSON.stringify({ year: currentYear, quarter: currentQuarter }) 
                                  });
                                  const qObj = await createResp.json();
                                  
                                  if (qObj && qObj.id) {
                                    // Update quarter data
                                    await axios.patch(`http://localhost:8000/api/quarters/${qObj.id}/`, cleaned);
                                    
                                    // Handle file upload if present
                                    if (payload.evidence_file) {
                                      const formData = new FormData();
                                      formData.append('file', payload.evidence_file);
                                      await axios.post(`http://localhost:8000/api/quarters/${qObj.id}/upload-evidence/`, formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                      });
                                    }
                                    
                                    // Submit for approval
                                    await axios.post(`http://localhost:8000/api/quarters/${qObj.id}/submit/`);
                                    
                                    setPerformanceChanges(prev => { 
                                      const clone = { ...prev }; 
                                      delete clone[obj.id]; 
                                      return clone; 
                                    });
                                    fetchObjectives();
                                    setSnackbar({ 
                                      open: true, 
                                      message: 'Performance data submitted successfully.', 
                                      severity: 'success' 
                                    });
                                  }
                                } catch (err) {
                                  console.error(err);
                                  setSnackbar({ 
                                    open: true, 
                                    message: 'Submission failed. Please try again.', 
                                    severity: 'error' 
                                  });
                                }
                              }}
                            >
                              Submit
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Paper>
                );
              })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTable({ subtitle: null, criteria: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Comment Modal */}
      <Dialog 
        open={!!rejectingObjective} 
        onClose={() => { setRejectingObjective(null); setRejectionComment(''); }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {rejectingObjective?.type === 'unit' ? 'Reject Unit of Measure' : 'Rejection Reason'}
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ marginTop: 0, fontSize: 14, color: '#374151' }}>
            {rejectingObjective?.type === 'unit' 
              ? 'Provide a brief explanation for rejecting this unit of measure. The user will be able to resubmit with corrections.'
              : 'Provide a brief explanation for rejecting this submission.'
            }
          </p>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            autoFocus
            placeholder="Enter rejection reason..."
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRejectingObjective(null); setRejectionComment(''); }}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            disabled={!rejectionComment.trim()} 
            onClick={async () => {
              if (!rejectingObjective) return;
              try {
                if (rejectingObjective.type === 'unit') {
                  await axios.post(`http://localhost:8000/api/objectives/${rejectingObjective.id}/reject-unit-of-measure/`, { 
                    rejection_comment: rejectionComment 
                  });
                  setSnackbar({ 
                    open: true, 
                    message: 'Unit of Measure rejected.', 
                    severity: 'info' 
                  });
                } else {
                  await axios.post(`http://localhost:8000/api/objectives/${rejectingObjective.id}/reject/`, { 
                    rejection_comment: rejectionComment 
                  });
                  setSnackbar({ 
                    open: true, 
                    message: 'Submission rejected.', 
                    severity: 'info' 
                  });
                }
                setRejectingObjective(null);
                setRejectionComment('');
                fetchObjectives();
              } catch (err) {
                setSnackbar({ 
                  open: true, 
                  message: 'Rejection failed.', 
                  severity: 'error' 
                });
              }
            }}
          >
            Submit Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </main>
  );
}

export default MedicalServices;