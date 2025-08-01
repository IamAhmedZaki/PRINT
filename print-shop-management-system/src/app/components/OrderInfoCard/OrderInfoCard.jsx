import React, { useState } from 'react';
import axios from 'axios';

const OrderInfoCard = ({ orderData, refreshData }) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: orderData.title || '',
    status: orderData.status || '',
    startDate: orderData.startDate?.split('T')[0] || '',
    dueDate: orderData.dueDate?.split('T')[0] || '',
    notes: orderData.notes || '',
  });

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://printmanager-frontend.onrender.com/api/orders/${orderData.id}`,
        formData
      );
      setShowModal(false);
      refreshData?.(); // optional callback to refresh parent
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update order');
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-[#111928]">Order Information</h3>
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 text-sm text-[#111928]">
            <p><strong>Title:</strong> {orderData.title || 'N/A'}</p>
            <p><strong>Status:</strong>{' '}
              <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(orderData.status)}`}>
                {orderData.status || 'N/A'}
              </span>
            </p>
            <p><strong>Start Date:</strong> {new Date(orderData.startDate).toLocaleDateString() || 'N/A'}</p>
            <p><strong>Due Date:</strong> {new Date(orderData.dueDate).toLocaleDateString() || 'N/A'}</p>
            <p><strong>Notes:</strong> {orderData.notes || 'N/A'}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Order</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderInfoCard;
