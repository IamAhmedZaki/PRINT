import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateServicePopup = ({ isOpen, onClose, onSave, workflows }) => {
  const [formData, setFormData] = useState({
    title: '',
    workflowId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.workflowId) {
      setError('All fields are required');
      return;
    }

    const payload = {
      ...formData,
      workflowId: parseInt(formData.workflowId, 10),
    };

    if (isNaN(payload.workflowId)) {
      setError('Invalid Workflow ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create service');
      const newService = await response.json();
      onSave(newService, payload.workflowId);
      onClose();
      toast.success('Service created successfully');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
      setError('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-[600px] shadow-xl transform transition-all duration-300 ease-in-out animate-popup">
        <h2 className="text-xl font-bold text-[#111928] mb-4">Create Service</h2>
        {error && <div className="mb-4 p-3 bg-[#ef4444]/10 text-[#ef4444] rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111928]">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928]">Workflow</label>
            <select
              name="workflowId"
              value={formData.workflowId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            >
              <option value="">Select a Workflow</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-[13px] px-6 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-[13px] px-6 bg-[#5750f1] text-white rounded-lg flex items-center justify-center ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
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
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteServicePopup = ({ isOpen, onClose, serviceId, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://printmanager-api.onrender.com/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      onDelete(serviceId);
      onClose();
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-[600px] shadow-xl transform transition-all duration-300 ease-in-out animate-popup">
        <h2 className="text-xl font-bold text-[#111928] mb-4">Confirm Delete</h2>
        <p className="text-sm text-[#111928] mb-4">Are you sure you want to delete this service?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="py-[13px] px-6 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`py-[13px] px-6 bg-[#ef4444] text-white rounded-lg flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
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
            {loading ? 'Deleting...' : 'Delete Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DropdownMenu = ({ serviceId, menuPosition, menuOpen, onDelete, setMenuOpen }) => {
  if (menuOpen !== serviceId) return null;
  return createPortal(
    <div
      className="absolute bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-50 min-w-[150px] overflow-hidden dropdown-menu"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(serviceId);
          setMenuOpen(null); // Close the dropdown menu
        }}
        className="block w-full text-left px-4 py-2 text-sm text-[#111928] hover:bg-[#f7f9fc] transition"
      >
        Delete Service
      </button>
    </div>,
    document.getElementById('dropdown-portal') || document.body
  );
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://printmanager-api.onrender.com/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(Array.isArray(data) ? data : data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to fetch services');
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch workflows from API
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('https://printmanager-api.onrender.com/api/workflows');
        if (!response.ok) throw new Error('Failed to fetch workflows');
        const data = await response.json();
        setWorkflows(Array.isArray(data) ? data : data.workflows || []);
      } catch (error) {
        console.error('Error fetching workflows:', error);
        toast.error('Failed to fetch workflows');
        setWorkflows([]);
      }
    };
    fetchWorkflows();
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-button')) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCreateService = async (newService, workflowId) => {
    try {
      // Check if workflow data is already available in the workflows state
      let workflow = workflows.find((w) => w.id === workflowId);
      if (!workflow) {
        // Fetch the workflow if not found in state
        const response = await fetch(`https://printmanager-api.onrender.com/api/workflows/${workflowId}`);
        if (!response.ok) throw new Error('Failed to fetch workflow');
        workflow = await response.json();
      }
      // Merge workflow data into the new service
      const enrichedService = {
        ...newService,
        workflow: workflow || { title: 'N/A', stages: [] },
      };
      setServices((prevServices) => {
        const updatedServices = [...prevServices, enrichedService];
        return updatedServices.sort((a, b) => a.id - b.id); // Sort by ID for consistency
      });
    } catch (error) {
      console.error('Error enriching service with workflow:', error);
      toast.error('Failed to load workflow data');
      // Fallback: Add service without workflow data
      setServices((prevServices) => [
        ...prevServices,
        { ...newService, workflow: { title: 'N/A', stages: [] } },
      ]);
    }
  };

  const handleDeleteService = (serviceId) => {
    setServices((prevServices) => prevServices.filter((s) => s.id !== serviceId));
  };

  const handleMenuClick = (serviceId, event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const newPosition = {
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right + window.scrollX,
    };
    setMenuPosition(newPosition);
    setMenuOpen(menuOpen === serviceId ? null : serviceId);
  };

  return (
    <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setCreatePopupOpen(true)}
          className="py-[13px] px-6 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700"
        >
          Create Service
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-[#5750f1]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-10 text-[#9ca3af] text-lg">Data Not Found</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 sm:gap-4 xl:grid-cols-3 2xl:gap-7.5">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] relative">
              <h3 className="text-lg font-semibold text-[#111928] mb-2">Service: {service.title}</h3>
              <p className="text-[16px] text-[#111928] mb-2">Workflow: {service.workflow?.title || 'N/A'}</p>
              <div className="space-y-2">
                {service.workflow?.stages?.length > 0 ? (
                  service.workflow.stages.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stage.color || '#000000' }}
                      />
                      <span className="text-sm text-[#111928]">{stage.title}</span>
                      <span className="ml-auto text-sm text-[#111928] border-[1px] border-[#e5e7eb] rounded-full px-[20px] py-[2px]">
                        {stage.days}d
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#9ca3af]">No stages available</p>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <button
                  className="dropdown-button hover:text-[#2563eb] transition"
                  onClick={(e) => handleMenuClick(service.id, e)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="10" cy="4" r="2" />
                    <circle cx="10" cy="10" r="2" />
                    <circle cx="10" cy="16" r="2" />
                  </svg>
                </button>
                <DropdownMenu
                  serviceId={service.id}
                  menuPosition={menuPosition}
                  menuOpen={menuOpen}
                  onDelete={() => {
                    setSelectedService(service);
                    setDeletePopupOpen(true);
                  }}
                  setMenuOpen={setMenuOpen}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <CreateServicePopup
        isOpen={createPopupOpen}
        onClose={() => setCreatePopupOpen(false) }
        onSave={handleCreateService}
        workflows={workflows}
      />
      <DeleteServicePopup
        isOpen={deletePopupOpen}
        onClose={() => setDeletePopupOpen(false)}
        serviceId={selectedService?.id}
        onDelete={handleDeleteService}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}