import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('users');
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      alert("Access Denied. God Mode requires Admin privileges.");
      navigate('/');
    }
  }, [navigate, userInfo]);
 
  useEffect(() => {
    if (activeTab === 'users' && userInfo?.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/users`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setAllUsers(data);
          }
        } catch (error) {
          console.error("Failed to fetch users", error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setAllUsers(allUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Role update error:", error);
      alert("Something went wrong updating the database.");
    }
  };
  return (
    <div style={{ minHeight: '80vh', padding: '60px 5%', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px', background: '#fff', color: '#fff', borderRadius: '15px', padding: '20px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #444', marginBottom: '20px' }}>
            <h2 style={{ margin: '0', color: '#e74c3c' }}>Admin Control Center</h2>
            {/* <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '5px 0 0' }}>Admin Control Center</p> */}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('users')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'users' ? '#eee' : 'transparent', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><img style={{ width:'4vw', height:'2vh', marginBottom:'-2px' }} src="https://www.svgrepo.com/show/512729/profile-round-1342.svg" alt="" /> Manage Users</button>
            <button onClick={() => setActiveTab('inventory')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'inventory' ? '#eee' : 'transparent', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><img style={{ width:'5vw', height:'3vh', marginBottom:'-6px' }} src="https://www.svgrepo.com/show/532860/globe-alt-1.svg" alt="" />Global Inventory</button>
            <button onClick={() => setActiveTab('analytics')} style={{ padding: '12px 15px', textAlign: 'left', background: activeTab === 'analytics' ? '#eee' : 'transparent', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><img style={{ width:'5vw', height:'3vh', marginBottom:'-6px' }} src="https://www.svgrepo.com/show/165499/dollar-analysis-bars-chart.svg" alt="" /> Platform Analytics</button>
            
            <Link to="/account" style={{ textDecoration: 'none', marginTop: '20px' }}>
              <button style={{ width: '100%', padding: '12px 15px', textAlign: 'center', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', alignItems:'center' }}>Go Home</button>
            </Link>
          </nav>
        </div>
        <div style={{ flex: '3', minWidth: '300px', background: '#fff', borderRadius: '15px', padding: '40px' }}>
          
          {activeTab === 'users' && (
            <div>
              <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>All Platform Users</h2>
              
              {loadingUsers ? (
                <p>Accessing Present Users...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Name</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Role</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map(user => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#666', fontSize: '0.85rem' }}>{user._id.substring(user._id.length - 6)}</td>
                          
                          <td style={{ padding: '12px', fontWeight: '500' }}>{user.name}</td>
                          
                          <td style={{ padding: '12px' }}>{user.email}</td>

                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                              background: user.role === 'admin' ? '#ffebee' : user.role === 'seller' ? '#e8f5e9' : '#e3f2fd',
                              color: user.role === 'admin' ? '#c62828' : user.role === 'seller' ? '#2e7d32' : '#1565c0'
                            }}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select 
                              value={user.role} 
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={user._id === userInfo._id}
                              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', cursor: user._id === userInfo._id ? 'not-allowed' : 'pointer' }}
                            >
                              <option value="customer">Customer</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <h2 style={{ marginBottom: '20px' }}>Global Product Management</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Search, filter, and moderate every product listed on the platform.</p>
              <Link to="/admin/products">
                <button style={{ padding: '15px 30px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Launch Product Manager
                </button>
              </Link>
            </div>
          )}
          {activeTab === 'analytics' && <h2>Platform Analytics Coming Soon...</h2>}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;