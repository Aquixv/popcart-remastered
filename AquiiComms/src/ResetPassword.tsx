import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESET_PASSWORD } from '../graphql/mutations';
import { useApolloClient } from '@apollo/client/react';
    try {
      const result = await client.mutate<ResetPasswordData>({
        mutation: RESET_PASSWORD,
        variables: {
          resetToken: token,
          newPassword: password,
        },
      });

      const res = result.data?.resetPassword;

      if (res && res.success) {
        setMessage(res.message || 'Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(res?.message || 'Invalid or expired token.');
      }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setIsLoading(true);

    try {
      const {data, errors} = await client.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        resetToken : token,
        newPassword: password
      },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      
      if (!data) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        throw new Error ("Invalid or expired token.");
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
        <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Create New Password</h2>

        {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}
        {error && <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            placeholder="New Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;