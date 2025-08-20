import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Divider, Grid, Skeleton, Tooltip, Button, Stack, TextField, MenuItem } from '@mui/material';
import { IconTarget } from '@tabler/icons-react';

const colorForRaw = (val) => {
  if (val == null) return 'default';
  const n = parseFloat(val);
  if (isNaN(n)) return 'default';
  if (n >= 90) return 'success';
  if (n >= 70) return 'primary';
  if (n >= 50) return 'warning';
  return 'error';
};

const QuarterHistoryView = () => {
  const { year, quarter } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ status:'', branch:'', subtitle:'', criteria:'' });
  const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

  useEffect(() => {
    let active = true;
  const load = async () => {
      try {
        setLoading(true);
  const query = new URLSearchParams({ year, quarter, ...Object.fromEntries(Object.entries(filters).filter(([key,v])=> v)) });
    const res = await fetch(`${apiBase}objectives/history/?${query.toString()}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const json = await res.json();
        const yrs = json.years || {};
        const list = yrs[year]?.[quarter] || [];
        if (active) setEntries(list);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [year, quarter, apiBase, filters]);

  const handleFilterChange = (field) => (e) => {
    setFilters(f => ({ ...f, [field]: e.target.value }));
  };

  const buildExportUrl = (type) => {
  const query = new URLSearchParams({ year, quarter, ...Object.fromEntries(Object.entries(filters).filter(([key,v])=> v)) });
    return `${apiBase}objectives/history-export-${type}/?${query.toString()}`;
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Performance History - {year} Q{quarter}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb:1, flexWrap:'wrap' }}>
        <TextField size="small" label="Status" select value={filters.status} onChange={handleFilterChange('status')} sx={{ minWidth:120 }}>
          <MenuItem value="">All</MenuItem>
          {['DRAFT','PENDING','APPROVED','REJECTED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Branch" value={filters.branch} onChange={handleFilterChange('branch')} sx={{ minWidth:140 }} />
        <TextField size="small" label="Subtitle" value={filters.subtitle} onChange={handleFilterChange('subtitle')} sx={{ minWidth:140 }} />
        <TextField size="small" label="Criteria" value={filters.criteria} onChange={handleFilterChange('criteria')} sx={{ minWidth:140 }} />
        <Button size="small" variant="text" onClick={()=> setFilters({ status:'', branch:'', subtitle:'', criteria:'' })}>Reset</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb:2 }}>
        <Button size="small" variant="outlined" onClick={()=> window.open(buildExportUrl('excel'),'_blank')}>
          Export Excel
        </Button>
        <Button size="small" variant="outlined" onClick={()=> window.open(buildExportUrl('pdf'),'_blank')}>
          Export PDF
        </Button>
      </Stack>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      {loading && (
        <Box>
          {Array.from({ length: 3 }).map((_,i)=>(<Skeleton key={i} variant="rounded" height={80} sx={{ mb:2 }} />))}
        </Box>
      )}
      {!loading && entries.length === 0 && !error && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No data available for now
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {entries.map((e, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper variant="outlined" sx={{ p:2, position:'relative' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <IconTarget size={16} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {e.subtitle || '—'} / {e.criteria || 'No Criteria'}
                </Typography>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Unit</Typography>
                  <Typography variant="body2">{e.unit_of_measure || '—'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Weight</Typography>
                  <Typography variant="body2">{e.weight || '—'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Cumulative Actual</Typography>
                  <Typography variant="body2">{e.cumulative_actual || '—'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Rank</Typography>
                  <Typography variant="body2">{e.rank || '—'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">Explanation</Typography>
                  <Typography variant="body2">{e.explanation || '—'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">Contributing Factors</Typography>
                  <Typography variant="body2">{e.contributing_factors || '—'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">Raw Score</Typography>
                  <Chip size="small" color={colorForRaw(e.raw_score)} label={e.raw_score || '—'} />
                </Grid>
              </Grid>
              <Divider sx={{ my:1 }} />
              <Typography variant="caption" color="textSecondary">Status: {e.status}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuarterHistoryView;
