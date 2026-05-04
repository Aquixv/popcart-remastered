import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Email sent! Check your inbox.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Reset Password</h2>
        <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}
        {error && <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '14px', background: '#000', color: 'white', border: 'none', 
              borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', textDecoration: 'none'}}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;