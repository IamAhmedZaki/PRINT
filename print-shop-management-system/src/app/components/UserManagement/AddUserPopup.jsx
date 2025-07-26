import React, { useState, useEffect } from 'react';
import '@/app/CSS/popup.css';
import { toast } from 'react-toastify';

const AddUserPopup = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isActive: true,
    role: 'member',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: true,
        role: 'member',
      });
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      isActive: formData.isActive,
      isAdmin: formData.role === 'admin',
      isManager: formData.role === 'manager',
      isMember: formData.role === 'member',
    };
    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success('User created successfully');
        onUserCreated();
        onClose();
      } else {
        toast.error('Failed to create user');
        console.error('Error creating user:', await response.json());
        alert('Failed to create user. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while creating the user');
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-[600px] shadow-xl transform transition-all duration-300 ease-in-out animate-popup">
        <h2 className="text-2xl font-bold text-[#111928] mb-6">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af] text-[#111928] hover:border-[#5750f1] transition"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af] text-[#111928] hover:border-[#5750f1] transition"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af] text-[#111928] hover:border-[#5750f1] transition pr-10"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#111928] hover:text-[#5750f1] transition"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af] text-[#111928] hover:border-[#5750f1] transition"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af] text-[#111928] hover:border-[#5750f1] transition"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-white text-[#111928] hover:border-[#5750f1] transition"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928] mb-2">Status</label>
            <div className="flex items-center">
              <span className="text-sm text-[#111928] mr-3">{formData.isActive ? 'Active' : 'Inactive'}</span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                  formData.isActive ? 'bg-[#5750f1]' : 'bg-gray-200'
                } hover:ring-2 hover:ring-[#5750f1]/50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-[13px] px-6 bg-gray-200 text-[#111928] rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`py-[13px] px-6 bg-[#5750f1] text-white rounded-lg font-medium transition flex items-center justify-center cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;