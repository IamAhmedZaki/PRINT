"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateProduct() {
  const router = useRouter();
  const [productData, setProductData] = useState({
    title: '',
    image: null,
    unitPrice: '',
    category: '',
    colorOptions: [], // Array for multiple colors
    sizeOptions: [], // Array for multiple sizes
    serviceId: '',
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Predefined colors and sizes
  const colorOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Orange'];
  const sizeOptions = ['Small', 'Medium', 'Large', 'XL', 'XXL'];

  // Predefined categories
  const categoryOptions = ['GOODS_WITH_SERVICE', 'SERVICE'];

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://printmanager-api.onrender.com/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        const servicesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.services)
          ? data.services
          : [];
        setServices(servicesArray);
      } catch (err) {
        toast.error(err.message || 'An error occurred while fetching services');
        console.error('Error fetching services:', err);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multiple select for colors
  const handleColorChange = (e) => {
    const selectedColors = Array.from(e.target.selectedOptions).map(option => option.value);
    setProductData((prev) => ({
      ...prev,
      colorOptions: selectedColors,
    }));
  };

  // Handle multiple select for sizes
  const handleSizeChange = (e) => {
    const selectedSizes = Array.from(e.target.selectedOptions).map(option => option.value);
    setProductData((prev) => ({
      ...prev,
      sizeOptions: selectedSizes,
    }));
  };

  // Handle image upload
  const handleImageUpload = (files) => {
    if (!files || !files[0] || !files[0].type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
    }
    setProductData((prev) => ({ ...prev, image: files }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.title || !productData.unitPrice || !productData.category || !productData.serviceId || productData.colorOptions.length === 0 || productData.sizeOptions.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!productData.image) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', productData.title);
    const files = productData.image;
    for (let file of files) {
      formData.append('files', file);
    }
    formData.append('unitPrice', parseInt(productData.unitPrice));
    formData.append('category', productData.category);
    formData.append('colorOptions', JSON.stringify(productData.colorOptions)); // Send as JSON array
    formData.append('sizeOptions', JSON.stringify(productData.sizeOptions)); // Send as JSON array
    formData.append('serviceId', parseInt(productData.serviceId));

    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/products', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }
      toast.success('Product created successfully');
      setProductData({
        title: '',
        image: null,
        unitPrice: '',
        category: '',
        colorOptions: [],
        sizeOptions: [],
        serviceId: '',
      });
      fileInputRef.current.value = '';
      setTimeout(() => {
        router.push('/dashboard/products/list');
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Product Title</label>
            <input
              type="text"
              name="title"
              value={productData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Product Image</label>
            <div
              className={`w-full h-32 border-2 border-dashed border-[#e5e7eb] rounded-lg flex items-center justify-center text-[#111928] cursor-pointer ${
                dragActive ? 'bg-[#f7f9fc]' : ''
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleImageClick}
            >
              {productData.image && productData.image[0] ? (
                <img
                  src={URL.createObjectURL(productData.image[0])}
                  alt="Product Preview"
                  className="h-full object-contain"
                />
              ) : (
                <p className="text-sm">Drag and drop an image or click to upload</p>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Unit Price ($)</label>
            <input
              type="number"
              name="unitPrice"
              value={productData.unitPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Color Options */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Colors</label>
            <select
              name="colorOptions"
              multiple
              value={productData.colorOptions}
              onChange={handleColorChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            >
              {colorOptions.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple colors</p>
          </div>

          {/* Size Options */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Sizes</label>
            <select
              name="sizeOptions"
              multiple
              value={productData.sizeOptions}
              onChange={handleSizeChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            >
              {sizeOptions.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple sizes</p>
          </div>

          {/* Service Options */}
          <div>
            <label className="block text-sm font-medium text-[#111928]">Service</label>
            <select
              name="serviceId"
              value={productData.serviceId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            >
              <option value="">Select Service</option>
              {Array.isArray(services) && services.length > 0 ? (
                services.map((service, index) => (
                  <option key={index} value={service.id}>
                    {service.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No services available
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`py-3 px-8 bg-[#5750f1] text-white rounded-lg flex items-center ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}