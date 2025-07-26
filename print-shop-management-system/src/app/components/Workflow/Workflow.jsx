"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateWorkflowPopup = ({ isOpen, onClose, onSave }) => {
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workflowTitle.trim()) {
      setError('Workflow title is required');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: workflowTitle }),
      });
      if (!response.ok) throw new Error('Failed to create workflow');
      const newWorkflow = await response.json();
      onSave(newWorkflow);
      onClose();
      toast.success('Workflow created successfully');
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
      setError('Failed to create workflow');
    } finally {
      setLoading(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-[600px] shadow-xl transform transition-all duration-300 ease-in-out animate-popup">
        <h2 className="text-xl font-bold text-[#111928] mb-4">Create Workflow</h2>
        {error && <div className="mb-4 p-3 bg-[#ef4444]/10 text-[#ef4444] rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111928]">Workflow Title</label>
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
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
              className={`py-[13px] px-6 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700 flex items-center justify-center ${
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
            {loading ? 'Creating...' : 'Create Workflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteWorkflowPopup = ({ isOpen, onClose, workflowId, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://printmanager-api.onrender.com/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete workflow');
      onDelete(workflowId);
      onClose();
      toast.success('Workflow deleted successfully');
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-[600px] shadow-xl transform transition-all duration-300 ease-in-out animate-popup">
        <h2 className="text-xl font-bold text-[#111928] mb-4">Confirm Delete</h2>
        <p className="text-sm text-[#111928] mb-4">Are you sure you want to delete this workflow?</p>
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
            {loading ? 'Deleting...' : 'Delete Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DropdownMenu = ({ workflowId, menuPosition, menuOpen, onDelete }) => {
  if (menuOpen !== workflowId) return null;
  return createPortal(
    <div
      className="absolute top-0 bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-50 min-w-[150px] overflow-hidden dropdown-menu"
      style={{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(workflowId);
        }}
        className="block w-full text-left px-4 py-2 text-sm text-[#111928] hover:bg-[#f7f9fc] transition"
      >
        Delete Workflow
      </button>
    </div>,
    document.getElementById('dropdown-portal') || document.body
  );
};

export default function Workflow() {
  const [workflows, setWorkflows] = useState([]);
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch workflows from API
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://printmanager-api.onrender.com/api/workflows');
        if (!response.ok) throw new Error('Failed to fetch workflows');
        const data = await response.json();
        setWorkflows(Array.isArray(data) ? data : data.workflows || []);
      } catch (error) {
        console.error('Error fetching workflows:', error);
        setWorkflows([]);
      } finally {
        setIsLoading(false);
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

  const handleCreateWorkflow = (newWorkflow) => {
    setWorkflows([...workflows, newWorkflow]);
  };

  const handleDeleteWorkflow = (workflowId) => {
    setWorkflows(workflows.filter((wf) => wf.id !== workflowId));
  };

  const handleMenuClick = (workflowId, event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const newPosition = {
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right + window.scrollX,
    };
    setMenuPosition(newPosition);
    setMenuOpen(menuOpen === workflowId ? null : workflowId);
  };

  return (
    <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setCreatePopupOpen(true)}
          className="py-[13px] px-6 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700"
        >
          Create Workflow
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : workflows.length === 0 ? (
        <div className="text-center py-10 text-[#9ca3af] text-lg">Data Not Found</div>
      ) : (
      <div className="space-y-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] relative">
            <div className="flex gap-4 items-center mb-4">
              <h3 className="text-[24px] font-semibold text-[#111928]">
                {workflow.title}
              </h3> 
              <span className="text-sm text-[#111928] border-[1px] border-[#e5e7eb] rounded-full px-[18px] py-[2px]">
                {workflow.stages ? workflow.stages.length : 0} steps
              </span>
            </div>
            <div className="flex items-center">
              {workflow.stages ? (
              <>
              {workflow.stages.map((stage, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center gap-[10px] w-[170px] p-[20px] rounded-lg border-[1px] border-[#e5e7eb]">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium text-[#111928]">{stage.title}</span>
                    <span className="text-sm text-[#111928] border-[1px] border-[#e5e7eb] rounded-full px-[20px] py-[2px]">
                      {stage.days}d
                    </span>
                  </div>
                  {index < workflow.stages.length - 1 && (
                    <span className="text-[#111928] mx-[10px]">→</span>
                  )}
                </div>
              ))}
              </>
              ) : (<span>Stages Data Not Found</span>)}
            </div>
            <div className="absolute top-4 right-4">
              <button
                className="dropdown-button hover:text-[#2563eb] transition"
                onClick={(e) => handleMenuClick(workflow.id, e)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="4" r="2" />
                  <circle cx="10" cy="10" r="2" />
                  <circle cx="10" cy="16" r="2" />
                </svg>
              </button>
              <DropdownMenu
                workflowId={workflow.id}
                menuPosition={menuPosition}
                menuOpen={menuOpen}
                onDelete={() => {
                  setSelectedWorkflow(workflow);
                  setDeletePopupOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      )}
      <CreateWorkflowPopup
        isOpen={createPopupOpen}
        onClose={() => setCreatePopupOpen(false)}
        onSave={handleCreateWorkflow}
      />
      <DeleteWorkflowPopup
        isOpen={deletePopupOpen}
        onClose={() => setDeletePopupOpen(false)}
        workflowId={selectedWorkflow?.id}
        onDelete={handleDeleteWorkflow}
      />
      <ToastContainer />
    </div>
  );
}