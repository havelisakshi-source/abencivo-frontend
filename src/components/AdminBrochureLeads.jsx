import React, { useEffect, useState } from 'react';

export default function AdminBrochureLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://abencivo-bio.onrender.com';
  const token = localStorage.getItem('adminToken'); // Your existing JWT token

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/brochure-leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch brochure leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading leads...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📄 Brochure Download Leads</h2>
        <button onClick={fetchLeads} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#fce7e7' }}>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.td}>{new Date(lead.created_at).toLocaleString()}</td>
                <td style={styles.td}><b>{lead.name}</b></td>
                <td style={styles.td}>{lead.phone}</td>
                <td style={styles.td}>{lead.email}</td>
                <td style={styles.td}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    backgroundColor: lead.verified ? '#dcfce7' : '#fee2e2', 
                    color: lead.verified ? '#16a34a' : '#dc2626' 
                  }}>
                    {lead.verified ? '✅ Verified' : '❌ Not Verified'}
                  </span>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No brochure leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  th: { padding: '12px 15px', fontWeight: 'bold', color: '#333', borderBottom: '2px solid #ddd' },
  td: { padding: '12px 15px', color: '#444' }
};