import React from 'react';
const { useState, useEffect, useRef } = React;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { analyticsAPI } from '../services/api';
import L from 'leaflet';

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#f97316', '#14b8a6', '#e11d48'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [areaStats, setAreaStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [summaryData, heatData, areas] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getHeatmap(),
        analyticsAPI.getAreas()
      ]);
      setSummary(summaryData);
      setHeatmapData(heatData);
      setAreaStats(areas);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize heatmap
  useEffect(() => {
    if (!loading && mapRef.current && heatmapData.length > 0 && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add circle markers as heatmap visualization
      heatmapData.forEach(point => {
        L.circleMarker([point.lat, point.lng], {
          radius: 8,
          fillColor: '#ef4444',
          color: '#dc2626',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.5
        }).addTo(mapInstanceRef.current)
          .bindPopup(`Violation: ${point.violationType?.replace(/_/g, ' ')}`);
      });

      // Fit bounds if there are points
      if (heatmapData.length > 0) {
        const bounds = L.latLngBounds(heatmapData.map(p => [p.lat, p.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, heatmapData]);

  const formatViolation = (type) => type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  // Prepare chart data
  const violationChartData = (summary?.violationsByType || []).map(v => ({
    name: formatViolation(v._id),
    count: v.count
  }));

  const dailyChartData = (summary?.dailyReports || []).map(d => ({
    date: d._id.slice(5), // MM-DD
    count: d.count
  }));

  const statusData = [
    { name: 'Pending', value: summary?.pendingReports || 0 },
    { name: 'Approved', value: summary?.approvedReports || 0 },
    { name: 'Rejected', value: summary?.rejectedReports || 0 },
  ].filter(d => d.value > 0);

  const vehicleData = (summary?.vehicleTypes || []).map(v => ({
    name: v._id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
    value: v.count
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics Dashboard 📈</h1>
        <p className="page-subtitle">Comprehensive traffic violation statistics and insights</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{summary?.totalReports || 0}</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-label">This Week</div>
            <div className="stat-value">{summary?.weeklyCount || 0}</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">📆</div>
          <div className="stat-info">
            <div className="stat-label">This Month</div>
            <div className="stat-value">{summary?.monthlyCount || 0}</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{summary?.pendingReports || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Violations by Type - Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Most Common Violations</h3>
          </div>
          <div className="card-body">
            {violationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationChartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No violation data available</p></div>
            )}
          </div>
        </div>

        {/* Status Distribution - Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Report Status Distribution</h3>
          </div>
          <div className="card-body">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={['#f59e0b', '#22c55e', '#ef4444'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No status data available</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid">
        {/* Daily Trend - Line Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daily Reports (Last 30 Days)</h3>
          </div>
          <div className="card-body">
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="var(--primary-500)" strokeWidth={2} dot={{ fill: 'var(--primary-500)' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No daily data available</p></div>
            )}
          </div>
        </div>

        {/* Vehicle Types - Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Vehicle Type Distribution</h3>
          </div>
          <div className="card-body">
            {vehicleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No vehicle data available</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h3 className="card-title">📍 Violation Heatmap</h3>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
            {heatmapData.length} locations
          </span>
        </div>
        <div className="map-container">
          <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
        </div>
      </div>

      {/* Area-wise Stats */}
      {areaStats.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Area-wise Violation Reports</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Area / Location</th>
                    <th>Total Violations</th>
                    <th>Top Violation Types</th>
                  </tr>
                </thead>
                <tbody>
                  {areaStats.map((area, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{area._id}</td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--primary-500)',
                          fontSize: 'var(--font-lg)'
                        }}>
                          {area.count}
                        </span>
                      </td>
                      <td>
                        {[...new Set(area.violations)].slice(0, 3).map(v => (
                          <span className="violation-badge" key={v} style={{ marginRight: 4, marginBottom: 2 }}>
                            {formatViolation(v)}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
