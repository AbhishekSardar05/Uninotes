// AdminLogin.jsx - Redesigned
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', formData.username);
      
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        console.log('Admin login successful');
        // Store admin token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        window.location.href = '/admin';
        // Redirect to admin panel
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Test function to check backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/health');
      const data = await response.json();
      console.log('Backend health check:', data);
      alert(`Backend status: ${data.status}\nMessage: ${data.message}`);
    } catch (error) {
      console.error('Backend connection failed:', error);
      alert('Cannot connect to backend. Make sure the server is running on port 5000.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Access the admin panel with your credentials
          </p>
          <p className="mt-1 text-xs text-purple-400">
            Default: admin / admin123
          </p>
        </div>
        
        <div className="glass-effect py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded text-sm">
                {error}
                <button 
                  type="button" 
                  onClick={testBackendConnection}
                  className="ml-2 text-red-300 underline text-xs"
                >
                  Test Connection
                </button>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="admin"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="admin123"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in as Admin'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-purple-200">
            Regular user?{' '}
            <a 
              href="/dashboard" 
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Go to student dashboard
            </a>
          </p>
          <button 
            onClick={testBackendConnection}
            className="mt-2 text-xs text-purple-400 underline"
          >
            Test backend connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;