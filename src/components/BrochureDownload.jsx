import React, { useState } from 'react';

export default function BrochureDownload() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Download
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [otp, setOtp] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://abencivo-bio.onrender.com';

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
      setError(err.message);
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
      
      // Ensure the URL is absolute
      const fullUrl = data.brochureUrl.startsWith('http') ? data.brochureUrl : `${BACKEND_URL}${data.brochureUrl}`;
      setBrochureUrl(fullUrl);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset state after closing
    setTimeout(() => { 
      setStep(1); 
      setFormData({ name: '', phone: '', email: '' }); 
      setOtp(''); 
      setError(''); 
    }, 300);
  };

  return (
    <>
      {/* The button that triggers the popup */}
      <button onClick={() => setIsOpen(true)} style={styles.downloadBtn}>
        📄 Download Brochure
      </button>

      {isOpen && (
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
                <button type="submit" disabled={loading} style={styles.button}>
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
                <button type="submit" disabled={loading} style={styles.button}>
                  {loading ? 'Verifying...' : 'Verify & Download'}
                </button>
              </form>
            )}

            {step === 3 && (
              <div style={{...styles.form, textAlign: 'center'}}>
                <h2 style={styles.title}>✅ Verified!</h2>
                <p style={styles.subtitle}>Your download is ready.</p>
                <a href={brochureUrl} target="_blank" rel="noopener noreferrer" style={{...styles.button, display: 'block', textDecoration: 'none', marginTop: '20px'}}>
                  📥 Click Here to View Brochure
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Basic inline styles (you can replace these with your own CSS classes)
const styles = {
  downloadBtn: { padding: '12px 24px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  title: { margin: 0, color: '#dc2626', fontSize: '24px' },
  subtitle: { margin: '0 0 10px 0', color: '#666', fontSize: '14px' },
  input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#dc2626', fontSize: '14px', margin: 0 }
};