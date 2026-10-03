import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // <-- Added this
import { API_BASE } from '../config';

export default function BrochureDownload() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [otp, setOtp] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = (API_BASE || 'https://abencivo-bio.onrender.com').trim();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/brochure/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/brochure/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      const fullUrl = data.brochureUrl.startsWith('http') ? data.brochureUrl : `${BACKEND_URL}${data.brochureUrl}`;
      setBrochureUrl(fullUrl);
      setStep(3);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => { 
      setStep(1); 
      setFormData({ name: '', phone: '', email: '' }); 
      setOtp(''); 
      setError(''); 
    }, 300);
  };

  // The modal is now rendered via createPortal to avoid z-index overlap issues
  const modalContent = isOpen ? (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={closeModal} style={styles.closeBtn}>✕</button>
        
        {step === 1 && (
          <form onSubmit={handleRequestOtp} style={styles.form}>
            <h2 style={styles.title}>Get Our Brochure</h2>
            <p style={styles.subtitle}>Please enter your details to receive the download link.</p>
            <input style={styles.input} placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input style={styles.input} placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input style={styles.input} type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <h2 style={styles.title}>Verify Your Email</h2>
            <p style={styles.subtitle}>We sent a 6-digit code to <b>{formData.email}</b></p>
            <input 
              style={{...styles.input, textAlign: 'center', letterSpacing: '8px', fontSize: '24px'}} 
              placeholder="000000" 
              maxLength="6" 
              required 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Verifying...' : 'Verify & Download'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{...styles.form, textAlign: 'center'}}>
            <h2 style={styles.title}>✅ Verified!</h2>
            <p style={styles.subtitle}>Your download is ready.</p>
            <a href={brochureUrl} target="_blank" rel="noopener noreferrer" style={{...styles.submitBtn, display: 'block', textDecoration: 'none', marginTop: '20px', textAlign: 'center'}}>
              📥 Click Here to View Brochure
            </a>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={styles.downloadBtn}>
        📄 Download Brochure
      </button>
      {/* Render the modal at the root level of the DOM */}
      {createPortal(modalContent, document.body)}
    </>
  );
}

const styles = {
  downloadBtn: { 
    padding: '12px 24px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', 
    borderRadius: '50px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(220, 38, 38, 0.4)', display: 'inline-flex',
    alignItems: 'center', gap: '8px', marginTop: '15px'
  },
  submitBtn: { 
    padding: '12px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', 
    borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', width: '100%' 
  },
  overlay: { 
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
    backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', 
    alignItems: 'center', zIndex: 999999, backdropFilter: 'blur(6px)'
  },
  modal: { 
    backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '90%', 
    maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    boxSizing: 'border-box'
  },
  closeBtn: { 
    position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', 
    fontSize: '20px', cursor: 'pointer', color: '#666', fontWeight: 'bold'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  title: { margin: 0, color: '#dc2626', fontSize: '24px', textAlign: 'center' },
  subtitle: { margin: '0 0 10px 0', color: '#666', fontSize: '14px', textAlign: 'center' },
  input: { 
    padding: '12px 15px', borderRadius: '8px', border: '1px solid #ccc', 
    fontSize: '16px', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff9c4' 
  },
  error: { color: '#dc2626', fontSize: '14px', margin: 0, textAlign: 'center' }
};