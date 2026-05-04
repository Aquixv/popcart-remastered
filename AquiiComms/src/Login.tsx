import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './AuthContext';
import { useFavorites } from './FavoritesContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchFavorites } = useFavorites();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userParam = searchParams.get('user');

    if (userParam) {
      try {
        const userObj = JSON.parse(decodeURIComponent(userParam));
        
        login(userObj);
        fetchFavorites(); 
        
        window.location.href = '/account'; 
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, [location.search, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'password must be 6 characters or longer')
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid email or password');
        }
        login(data); 

        fetchFavorites();

        navigate('/account'); 

     } catch (error) {
  if (error instanceof Error) {
    alert(error.message);
  }
      } finally {
        setSubmitting(false); 
      }
    }
  });
  return (
    <div className="auth-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
      <div className="auth-card" style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h1>
          <p style={{ color: '#666' }}>Log in to your Popcart account.</p>
        </div>

        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
            <input 
  type="text" 
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
              <Link to='/forgot-password' style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <input 
  type="text" 
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

          <button 
            type="submit" 
            disabled={!formik.isValid || formik.isSubmitting}
            style={{ 
              width: '100%', padding: '15px', background: (!formik.isValid || formik.isSubmitting) ? '#ccc' : '#000', 
              color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px',
              transition: 'background 0.3s'
            }}
          >
            Log In
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ padding: '0 15px', color: '#999', fontSize: '0.9rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          </div>

          <a 
      href= {`${import.meta.env.VITE_API_URL}/users/auth/google`}
      style={{ width: '100%', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
      Continue with Google
    </a>
<a 
      href={`${import.meta.env.VITE_API_URL}/users/auth/github`}
      style={{ width: '100%', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
    >
      <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="Github" style={{ width: '20px' }} />
      Continue with Github
    </a>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
        </p>
        {/* <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '0.95rem' }}>
                  Forgot Your Password? <Link to="/forgot-password" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>Click Here.</Link>
                </p> */}
      </div>
    </div>
  );
};

export default Login;