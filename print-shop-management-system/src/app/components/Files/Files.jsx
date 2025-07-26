import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Mock files data
const files = [
  {
    id: 1,
    name: 'logo-design-v2.png',
    type: 'image',
    size: '2.1 MB',
    orderId: 'ORD-001',
    customer: 'John Smith',
    uploadedBy: 'Sarah Designer',
    uploadedAt: '2025-01-16 02:15 PM',
    status: 'approved',
    workflowState: 'design',
    version: 2,
  },
  {
    id: 2,
    name: 'specifications.pdf',
    type: 'document',
    size: '156 KB',
    orderId: 'ORD-001',
    customer: 'John Smith',
    uploadedBy: 'John Smith',
    uploadedAt: '2025-01-15 09:00 AM',
    status: 'approved',
    workflowState: 'design',
    version: 1,
  },
  {
    id: 3,
    name: 'mockup-sports-jersey.jpg',
    type: 'image',
    size: '3.2 MB',
    orderId: 'ORD-003',
    customer: 'Sports Club',
    uploadedBy: 'Mike Designer',
    uploadedAt: '2025-01-16 11:30 AM',
    status: 'pending',
    workflowState: 'mockup',
    version: 1,
  },
  {
    id: 4,
    name: 'dtf-print-ready.ai',
    type: 'design',
    size: '5.8 MB',
    orderId: 'ORD-002',
    customer: 'ABC Company',
    uploadedBy: 'Design Team',
    uploadedAt: '2025-01-15 04:45 PM',
    status: 'approved',
    workflowState: 'printing',
    version: 3,
  },
  {
    id: 5,
    name: 'quality-check-photos.zip',
    type: 'archive',
    size: '12.4 MB',
    orderId: 'ORD-005',
    customer: 'Tech Startup',
    uploadedBy: 'Production Team',
    uploadedAt: '2025-01-16 03:20 PM',
    status: 'approved',
    workflowState: 'finishing',
    version: 1,
  },
];

const getFileIcon = (type) => {
  switch (type) {
    case 'image':
      return <span style={{ color: '#3b82f6' }}>📷</span>;
    case 'document':
      return <span style={{ color: '#ef4444' }}>📄</span>;
    case 'design':
      return <span style={{ color: '#a855f7' }}>🎨</span>;
    case 'archive':
    case 'other':
      return <span style={{ color: '#f97316' }}>📦</span>;
    default:
      return <span style={{ color: '#6b7280' }}>📄</span>;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function Files() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType || (filterType === 'other' && !['image', 'document'].includes(file.type));
    return matchesSearch && matchesFilter;
  });

  const pendingFiles = files.filter((f) => f.status === 'pending').length;
  const imageFiles = files.filter((f) => f.type === 'image').length;

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

  // Handle menu open and position
  const handleMenuClick = (fileId, event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const newPosition = {
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right + window.scrollX,
    };
    setMenuPosition(newPosition);
    setMenuOpen(menuOpen === fileId ? null : fileId);
  };

  const DropdownMenu = ({ fileId }) => {
    if (menuOpen !== fileId) return null;
    return createPortal(
      <div
        className="absolute top-0 bg-white border border-[#e5e7eb] rounded-lg shadow-xl z-50 min-w-[150px] overflow-hidden dropdown-menu"
        style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Preview', fileId); setMenuOpen(null); }}
          className="block w-full text-left px-4 py-2 text-sm text-[#111928] hover:bg-[#f7f9fc] transition"
        >
          Preview
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Download', fileId); setMenuOpen(null); }}
          className="block w-full text-left px-4 py-2 text-sm text-[#111928] hover:bg-[#f7f9fc] transition"
        >
          Download
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('View Order', fileId); setMenuOpen(null); }}
          className="block w-full text-left px-4 py-2 text-sm text-[#111928] hover:bg-[#f7f9fc] transition"
        >
          View Order
        </button>
      </div>,
      document.getElementById('dropdown-portal') || document.body
    );
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Total Files</h3>
          <div className="text-2xl font-bold text-[#111928]">{files.length}</div>
          <p className="text-xs text-[#9ca3af] mt-1">Across all orders</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Pending Approval</h3>
          <div className="text-2xl font-bold text-[#111928]">{pendingFiles}</div>
          <p className="text-xs text-[#9ca3af] mt-1">Needs review</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Images</h3>
          <div className="text-2xl font-bold text-[#111928]">{imageFiles}</div>
          <p className="text-xs text-[#9ca3af] mt-1">Design files</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Storage Used</h3>
          <div className="text-2xl font-bold text-[#111928]">24.1 MB</div>
          <p className="text-xs text-[#9ca3af] mt-1">Total file size</p>
        </div>
      </div>

      {/* Search and Filter Options */}
      <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] mb-8">
        <div className="mb-4">
          <h2 className="font-medium text-gray-800 text-[24px]">File Library</h2>
          <p className="text-[18px] text-[#9ca3af]">Search and filter through all uploaded files</p>
        </div>
         <div className="flex items-center space-x-6">
        <input
          type="text"
          placeholder="Search by name, order, customer, or uploaded by"
          className="w-full sm:w-1/3 px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] text-[#111928]"
        >
          <option value="all">All Files</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="other">Other Files</option>
        </select>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-[10px] p-6 border-[1px] border-[#e5e7eb]">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-none bg-[#F7F9FC] py-4 text-base text-[#111928]">
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 min-w-[100px] xl:pl-7.5">File ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Order</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Uploaded By</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Upload Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-neutral-500 xl:pr-7.5">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-[#eee] transition-colors hover:bg-neutral-100/50"
                >
                  <td className="p-4 align-middle min-w-[100px] xl:pl-7.5">
                    <p className="text-[#111928]">{file.id}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <p className="text-[#111928]">{file.name}</p>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-[#111928]">{file.orderId}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-[#111928]">{file.customer}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-[#111928]">{file.uploadedBy}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-[#111928]">{file.uploadedAt}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <div className={`text-sm px-3 py-1 rounded-lg ${getStatusColor(file.status)}`}>{file.status}</div>
                  </td>
                  <td className="p-4 align-middle xl:pr-7.5">
                    <div className="relative flex justify-end">
                      <button
                        className="dropdown-button hover:text-[#2563eb] transition"
                        onClick={(e) => handleMenuClick(file.id, e)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <circle cx="10" cy="4" r="2" />
                          <circle cx="10" cy="10" r="2" />
                          <circle cx="10" cy="16" r="2" />
                        </svg>
                      </button>
                      <DropdownMenu fileId={file.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Files;