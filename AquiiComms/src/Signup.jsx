import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './AuthContext';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match') 
      .required('Please confirm your password')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong during signup');
        }

        login(data);

        navigate('/account'); 

      } catch (error) {
        setFieldError('email', error.message);
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <div className="auth-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
      <div className="auth-card" style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create an Account</h1>
          <p style={{ color: '#666' }}>Join Popcart to start shopping.</p>
        </div>

        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              {...formik.getFieldProps('name')}
              style={{ 
                width: '100%', padding: '12px 15px', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                border: formik.touched.name && formik.errors.name ? '1px solid #ff4757' : '1px solid #ddd'
              }}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: '#ff4757', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              {...formik.getFieldProps('email')}
              style={{ 
                width: '100%', padding: '12px 15px', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                border: formik.touched.email && formik.errors.email ? '1px solid #ff4757' : '1px solid #ddd'
              }}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: '#ff4757', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              {...formik.getFieldProps('password')}
              style={{ 
                width: '100%', padding: '12px 15px', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                border: formik.touched.password && formik.errors.password ? '1px solid #ff4757' : '1px solid #ddd'
              }}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: '#ff4757', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              {...formik.getFieldProps('confirmPassword')}
              style={{ 
                width: '100%', padding: '12px 15px', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                border: formik.touched.confirmPassword && formik.errors.confirmPassword ? '1px solid #ff4757' : '1px solid #ddd'
              }}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div style={{ color: '#ff4757', fontSize: '0.85rem', marginTop: '5px' }}>{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <button 
            type="submit" 
            disabled={!formik.isValid || formik.isSubmitting} 
            style={{ 
              width: '100%', padding: '15px', 
              background: (!formik.isValid || formik.isSubmitting) ? '#ccc' : '#000', 
              color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px',
              transition: 'background 0.3s'
            }}
          >
            Sign Up
          </button>
               <a 
      href={`${import.meta.env.VITE_API_URL}/users/auth/google`} 
      style={{ width: '100%', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
      Continue with Google
    </a>
    <a 
      href={`${import.meta.env.VITE_API_URL}/users/auth/github`} 
      style={{ width: '100%', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
    >
      <img src="https://www.svgrepo.com/show/473620/github.svg" alt="Github" style={{ width: '20px' }} />
      Continue with Github
    </a>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
        </p>
        {/* <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '0.95rem' }}>
          Forgot Your Password? <Link to="/forgot-password" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>Click Here.</Link>
        </p> */}
      </div>
    </div>
  );
};

export default Signup;