import  { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }

      // Make a request to your backend to reset the password
      const response = await axios.post('/api/auth/reset-password', {
        password,
        resetToken: window.location.pathname.split('/').pop(), // Extract reset token from URL
      });

      setMessage(response.data.message);
      toast.success(response.data.message)
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      toast.error(error.message)
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">New Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-1">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <button
        onClick={handleResetPassword}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Reset Password
      </button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}

export default ResetPassword;
