'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Create() {
  const [data, setData] = useState({
    name: '',
    email: '',
    mobile: '',
    mobile2: '',
    company: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);
  const mobile2Ref = useRef(null);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let firstInvalidField = null;

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
      if (!firstInvalidField) firstInvalidField = nameRef;
    }
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
      if (!firstInvalidField) firstInvalidField = emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
      if (!firstInvalidField) firstInvalidField = emailRef;
    }
    if (!data.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      if (!firstInvalidField) firstInvalidField = mobileRef;
    } else if (!/^\d{10,15}$/.test(data.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number (10-15 digits)';
      if (!firstInvalidField) firstInvalidField = mobileRef;
    }
    if (data.mobile2 && !/^\d{10,15}$/.test(data.mobile2)) {
      newErrors.mobile2 = 'Please enter a valid secondary mobile number (10-15 digits)';
      if (!firstInvalidField) firstInvalidField = mobile2Ref;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (firstInvalidField.current) {
        firstInvalidField.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.current.focus();
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setData({
          name: '',
          email: '',
          mobile: '',
          mobile2: '',
          company: '',
          address: '',
        });
        toast.success('Customer created successfully');
        setTimeout(() => {
          router.push('/dashboard/customer/list');
        }, 3000);
      } else {
        toast.error(result.message || 'Failed to create customer');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
        {errors.general && (
          <div className="mb-4 text-red-600 text-center">{errors.general}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-[#111928] font-medium mb-2">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              ref={nameRef}
            />
            {errors.name && (
              <div className="text-red-600 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#111928] font-medium mb-2">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter customer email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              ref={emailRef}
            />
            {errors.email && (
              <div className="text-red-600 text-sm mt-1">{errors.email}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-[#111928] font-medium mb-2">Mobile *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={data.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              ref={mobileRef}
            />
            {errors.mobile && (
              <div className="text-red-600 text-sm mt-1">{errors.mobile}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="mobile2" className="block text-[#111928] font-medium mb-2">Mobile 2 (Optional)</label>
            <input
              type="tel"
              id="mobile2"
              name="mobile2"
              value={data.mobile2}
              onChange={handleChange}
              placeholder="Enter secondary mobile number"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] ${errors.mobile2 ? 'border-red-500' : 'border-gray-300'}`}
              ref={mobile2Ref}
            />
            {errors.mobile2 && (
              <div className="text-red-600 text-sm mt-1">{errors.mobile2}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="company" className="block text-[#111928] font-medium mb-2">Company (Optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={data.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="address" className="block text-[#111928] font-medium mb-2">Address (Optional)</label>
            <textarea
              id="address"
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#5750f1] text-white p-[13px] rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading && (
              <svg className="mr-2 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Creating Customer...' : 'Create Customer'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}