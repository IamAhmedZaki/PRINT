"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import OrderInfoCard from 'N:/Fiver_F/Production/print-shop-management-system/src/app/components/OrderInfoCard/OrderInfoCard';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';




export default function ViewOrder() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    title: "",
    status: "",
    startDate: "",
    dueDate: "",
    notes: "",
   
  });
  const { orderId } = useParams();

  const fetchData = async () => {
  const response = await fetch(`https://printmanager-api.onrender.com/api/orders/${orderId}`);
  const data = await response.json();
  return data.items.map((item=>{
    return(
      item.product.id
    )
  })); // Return just the items array
};

// Usage
fetchData().then(items => {
  console.log(items); // Now you'll see the actual items
});


const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
const [currentsizeId, setCurrentSizeId] = useState(null);
const [currentOrderItemId, setCurrentOrderItemId] = useState(null);
const [sizeQuantities, setSizeQuantities] = useState([]);
const [editingSize, setEditingSize] = useState(null);
const [newSize, setNewSize] = useState({
  Size: '',
  Price: '',
  Quantity: '',
});

  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [productId, setproductId] = useState("");
  const [comments, setComments] = useState([]);
  const [isItemCollapsed, setIsItemCollapsed] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState({
    commentText: "",
    commentBy: "",
    is_internal: false,
  });


const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
const [isFilesModalOpenProduct, setIsFilesModalOpenProduct] = useState(false);
const [filesToDelete, setFilesToDelete] = useState([]);
const [newFile, setNewFile] = useState(null);
const [uploadProgress, setUploadProgress] = useState(0);
const [currentProductId, setCurrentProductId] = useState(null);




// Fetch size quantities when modal opens
const openSizeModal = async (orderItemId, productPrice) => {
  setIsSizeModalOpen(true);
  
  if (orderItemId) {
    
    setCurrentOrderItemId(orderItemId);
    
    // Initialize newSize with product's unitPrice
    setNewSize(prev => ({
      ...prev,
      Price: productPrice || 'HELLOWORLD@'
    }));
  
    try {
      const response = await axios.get(
        `https://printmanager-api.onrender.com/api/sizeQuantities/${orderItemId}`
      );
      setSizeQuantities(response.data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to load size quantities");
    }
  }else{
    setNewSize(prev => ({
      ...prev,
      Price: productPrice || 'HELLOWORLD'
    }));
  }
};

// Handle input changes for new/edit size
const handleSizeChange = (e) => {
  const { name, value } = e.target;
  if (editingSize) {
    setEditingSize(prev => ({ ...prev, [name]: value }));
  } else {
    setNewSize(prev => ({ ...prev, [name]: value }));
  }
};

// Create new size quantity
const handleAddSize = async () => {
  try {
    const response = await axios.post(
      'https://printmanager-api.onrender.com/api/sizeQuantities',
      {
        ...newSize,
        orderitemId: currentOrderItemId,
        createdBy: "User Name", // Replace with actual user
        Price: parseFloat(newSize.Price),
        Quantity: parseInt(newSize.Quantity),
      }
    );
    
    // setSizeQuantities(prev => [...prev, response.data]);
    setNewSize({ Size: '', Price: '', Quantity: '' });
    toast.success("Size added successfully");
  } catch (error) {
    console.error("Error adding size:", error);
    toast.error("Failed to add size");
  }
};

// Update existing size quantity
const handleUpdateSize = async () => {
  try {
    const response = await axios.put(
      `https://printmanager-api.onrender.com/api/sizeQuantities/${editingSize.id}`,
      {
        ...editingSize,
        Price: parseFloat(editingSize.Price),
        Quantity: parseInt(editingSize.Quantity),
      }
    );
    
    // setSizeQuantities(prev => 
    //   prev.map(size => size.id === editingSize.id ? response.data : size)
    // );
    setEditingSize(null);
    toast.success("Size updated successfully");
  } catch (error) {
    console.error("Error updating size:", error);
    toast.error("Failed to update size");
  }
};

// Delete size quantity
const handleDeleteSize = async (sizeId) => {
  try {
    await axios.delete(
      `https://printmanager-api.onrender.com/api/sizeQuantities/${sizeId}`
    );
    // setSizeQuantities(prev => prev.filter(size => size.id !== sizeId));
    toast.success("Size deleted successfully");
    setIsSizeModalOpen(false)
  } catch (error) {
    console.error("Error deleting size:", error);
    toast.error("Failed to delete size");
  }
};


const handleFileChange = (e) => {
  setNewFile(e.target.files[0]);
};

const toggleFileDelete = (fileId) => {
  setFilesToDelete(prev => 
    prev.includes(fileId) 
      ? prev.filter(id => id !== fileId) 
      : [...prev, fileId]
  );
};

const handleAddFile = async () => {
  if (!newFile) {
    toast.error("Please select a file first");
    return;
  }

  const formData = new FormData();
  formData.append('file', newFile);
  formData.append('orderId', orderId);
  formData.append('uploadedBy', "User Name"); // Replace with actual user

  try {
    setUploadProgress(0);
    const response = await axios.post(
      'https://printmanager-api.onrender.com/api/orderFiles',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      }
    );

    setOrderData(prev => ({
      ...prev,
      files: [...prev.files, response.data]
    }));
    setNewFile(null);
    toast.success("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload file");
  } finally {
    setUploadProgress(0);
  }
};

const handleAddFileProduct = async () => {
  if (!newFile || !currentProductId) {
    toast.error("Please select a file and ensure product is selected");
    return;
  }

  const formData = new FormData();
  formData.append('file', newFile);
  formData.append('productId', currentProductId);
  formData.append('uploadedBy', "User Name"); // Replace with actual user

  try {
    setUploadProgress(0);
    const response = await axios.post(
      'https://printmanager-api.onrender.com/api/orderFiles',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      }
    );

    // Update the specific product's files
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.product.id === currentProductId
          ? {
              ...item,
              product: {
                ...item.product,
                files: [...(item.product.files || []), response.data]
              }
            }
          : item
      )
    }));

    setNewFile(null);
    toast.success("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload file");
  } finally {
    setUploadProgress(0);
  }
};

const handleDeleteFiles = async () => {
  if (filesToDelete.length === 0) {
    toast.error("No files selected for deletion");
    return;
  }

  try {
    await Promise.all(
      filesToDelete.map(fileId => 
        axios.delete(`https://printmanager-api.onrender.com/api/orderFiles/${fileId}`)
      )
    );

    setOrderData(prev => ({
      ...prev,
      files: prev.files.filter(file => !filesToDelete.includes(file.id))
    }));
    setFilesToDelete([]);
    toast.success("Files deleted successfully");
  } catch (error) {
    console.error("Error deleting files:", error);
    toast.error("Failed to delete files");
  }
};


const openEditModal = () => {
  setEditedData({
    title: orderData.title,
    status: orderData.status,
    startDate: orderData.startDate.split('T')[0], // Format date for input
    dueDate: orderData.dueDate.split('T')[0], // Format date for input
    notes: orderData.notes,
  
  });
  setIsEditModalOpen(true);
};

const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  
  // Handle nested customer fields
  if (name.startsWith('customer.')) {
    const customerField = name.split('.')[1];
    setEditedData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [customerField]: value
      }
    }));
  } else {
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleSaveChanges = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      `https://printmanager-api.onrender.com/api/orders/${orderId}`,
      editedData
    );
    const orderRes = await fetch(`https://printmanager-api.onrender.com/api/orders/${orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order");
        const data = await orderRes.json();
        setOrderData(data);
    // setOrderData(response.data);
    setIsEditModalOpen(false);
    toast.success("Order updated successfully");
  } catch (error) {
    console.error('Error updating order:', error);
    toast.error(error.message || "Error updating order");
  }
};


  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch order data
        const orderRes = await fetch(`https://printmanager-api.onrender.com/api/orders/${orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order");
        const data = await orderRes.json();
        setOrderData(data);
        if (data.items) {
          setIsItemCollapsed(
            data.items.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
          );
        }

        // Fetch comments for the order
        const commentsRes = await fetch(`https://printmanager-api.onrender.com/api/comments?orderId=${orderId}`);
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsRes.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Error loading data");
      }
    }

    if (orderId) fetchData();
  }, [orderId]);

  if (!orderData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleItemCollapse = (index) => {
    setIsItemCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const openImageViewer = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
        return <span style={{ color: "#3b82f6" }}>📷</span>;
      case "pdf":
      case "doc":
      case "docx":
        return <span style={{ color: "#ef4444" }}>📄</span>;
      case "ai":
      case "psd":
        return <span style={{ color: "#a855f7" }}>🎨</span>;
      case "zip":
      case "rar":
        return <span style={{ color: "#f97316" }}>📦</span>;
      default:
        return <span style={{ color: "#6b7280" }}>📄</span>;
    }
  };

  const handleCommentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.commentText || !newComment.commentBy) {
      toast.error("Comment text and author are required");
      return;
    }

    try {
      const commentData = {
        orderId: parseInt(orderId),
        commentText: newComment.commentText,
        commentBy: newComment.commentBy,
        is_internal: newComment.is_internal,
      };

      const res = await fetch("https://printmanager-api.onrender.com/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      if (!res.ok) throw new Error("Failed to add comment");
      const addedComment = await res.json();
      setComments((prev) => [...prev, addedComment]);
      setNewComment({ commentText: "", commentBy: "", is_internal: false });
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Error adding comment");
    }
  };

  return (
    <div className="p-6">
    <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-medium text-gray-800 text-[24px]">Order Details - {orderData.orderNumber}</h2>
          <p className="text-[18px] text-[#9ca3af]">View details for order ID: {orderData.id}</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/order/list")}
          className="py-2 px-4 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Order List
        </button>
      </div>

      {/* Order Summary */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-sm font-medium text-[#111928]">Order Information</h3>
      <button
  onClick={openEditModal}
  className="text-blue-600 hover:underline text-sm"
>
  Edit
</button>
    </div>

    <div className="space-y-2 text-sm text-[#111928]">
      <p><strong>Title:</strong> {orderData.title || "N/A"}</p>
      <p><strong>Status:</strong> 
        <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(orderData.status)}`}>
          {orderData.status || "N/A"}
        </span>
      </p>
      <p><strong>Start Date:</strong> {new Date(orderData.startDate).toLocaleDateString() || "N/A"}</p>
      <p><strong>Due Date:</strong> {new Date(orderData.dueDate).toLocaleDateString() || "N/A"}</p>
      <p><strong>Notes:</strong> {orderData.notes || "N/A"}</p>
    </div>
  </div>

        <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Customer Information</h3>
          <div className="space-y-2 text-sm text-[#111928]">
            <p><strong>Name:</strong> {orderData.customer.name || "N/A"}</p>
            <p><strong>Email:</strong> {orderData.customer.email || "N/A"}</p>
            <p><strong>Mobile:</strong> {orderData.customer.mobile || "N/A"}</p>
            <p><strong>Company:</strong> {orderData.customer.company || "N/A"}</p>
            <p><strong>Address:</strong> {orderData.customer.address || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-[#111928] mb-4">Order Items</h2>
        {orderData.items.map((item, itemIndex) => {
          
          
          return(
          
          <div key={item.id} className="mb-6">
            <div
              className="flex justify-between items-center p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg cursor-pointer hover:bg-[#f1f5f9]"
              onClick={() => toggleItemCollapse(itemIndex)}
            >
              <h3 className="text-md font-medium text-[#111928]">Item #{itemIndex + 1} - {item.product?.title || "N/A"}</h3>
              <span>{isItemCollapsed[itemIndex] ? "+" : "−"}</span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isItemCollapsed[itemIndex] ? "max-h-0" : "max-h-[1000px]"
              }`}
            >
              <div className="p-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg mt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Product:</strong> {item.product?.title || "N/A"}</p>
                    <p><strong>Color:</strong> {item.color || "N/A"}</p>
                    <p><strong>Quantity:</strong> {item.quantity || "N/A"}</p>
                    <p><strong>Price:</strong> ${item.price?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p><strong>Service:</strong> {item.product?.service?.title || "N/A"}</p>
                    <p><strong>Workflow:</strong> {item.product?.service?.workflow?.title || "N/A"}</p>
                  </div>
                </div>

                {/* Size Quantities */}
                <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-[#111928]">Size Quantities</h4>
                  <button 
                    onClick={() => {openSizeModal(item.sizeQuantities.id);
                      setCurrentOrderItemId(item.id)
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </div>
                {item.sizeQuantities.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="flex gap-4 mb-2 p-2 bg-white border border-[#e5e7eb] rounded-lg">
                    <p><strong>Size:</strong> {size.Size || "N/A"}</p>
                    <p><strong>Price:</strong> ${size.Price?.toFixed(2) || "0.00"}</p>
                    <p><strong>Quantity:</strong> {size.Quantity || "0"}</p>
                    
                  </div>
                ))}
              </div>
                {isSizeModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Manage Size Quantities</h3>
        <button 
  onClick={() => {
    openSizeModal(item.id, item.product.unitPrice);
    setCurrentOrderItemId(item.id);
  }}
  className="text-blue-600 hover:underline text-sm"
>
  Edit
</button>
      </div>

      {/* Add/Edit Form */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {editingSize ? 'Edit Size' : 'Add New Size'}
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Size</label>
            <input
              type="text"
              name="Size"
              value={editingSize?.Size || newSize.Size}
              onChange={handleSizeChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., S, M, L"
            />
          </div>
          <div>
  <label className="block text-sm text-gray-600 mb-1">Price</label>
  <input
    type="number"
    name="Price"
    value={editingSize?.Price || newSize.Price || 'HELLL'}
    // onChange={handleSizeChange}
    className="w-full p-2 border rounded"
    placeholder={item.product.unitPrice?.toFixed(2) || "0.00"}
    step="0.01"
  />
</div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              name="Quantity"
              value={editingSize?.Quantity || newSize.Quantity}
              onChange={handleSizeChange}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          {editingSize ? (
            <>
              <button
                onClick={() => setEditingSize(null)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSize}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Size
              </button>
            </>
          ) : (
            <button
              onClick={handleAddSize}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Size
            </button>
          )}
        </div>
      </div>

      {/* Size Quantities List */}
      <div>
        <h4 className="font-medium mb-2">Current Sizes</h4>
        {item.sizeQuantities.length === 0 ? (
          <p className="text-gray-500">No sizes available</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {item.sizeQuantities.map((size) => (
              <div key={size.id} className="flex items-center gap-3 p-3 border rounded">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <span><strong>Size:</strong> {size.Size}</span>
                  <span><strong>Price:</strong> ${size.Price?.toFixed(2)}</span>
                  <span><strong>Qty:</strong> {size.Quantity}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSize(size)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSize(size.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
                {/* Product Files with Image View */}
                <div>
                  <h4 className="text-md font-medium text-[#111928] mb-2">Product Files</h4>
                  <button 
                      onClick={() => {
                        setIsFilesModalOpenProduct(true);
                        setCurrentProductId(item.product.id);  // Set the current product ID
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  {item.product?.files.map((file, fileIndex) => {
    // Define isImage here for each file
    const isImage = ["jpg", "jpeg", "png"].includes(
      file.fileName.split('.').pop().toLowerCase()
    );
    
    return (
      <div key={fileIndex} className="flex items-center gap-2 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg mb-2">
        {getFileIcon(file.fileName.split('.').pop())}
        <p className="text-sm text-[#111928] flex-1">{file.fileName}</p>
        {isImage && (
          <button
            onClick={() => openImageViewer(file.filePath)}
            className="text-[#2563eb] text-sm hover:underline"
          >
            View Image
          </button>
        )}
        <p className="text-xs text-[#9ca3af]">
          Uploaded: {new Date(file.uploadedAt).toLocaleString()}
        </p>
      </div>
    );
  })}
  {/* ProductFiles Edit Modal */}
  {isFilesModalOpenProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Manage Order Files</h3>
          <button 
            onClick={() => {
              setIsFilesModalOpenProduct(false);
              setFilesToDelete([]);
              setNewFile(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Add File Section */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Add New File</h4>
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={handleAddFileProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!newFile || uploadProgress > 0}
            >
              {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload'}
            </button>
          </div>
        </div>

        {/* Delete Files Section */}
        <div>
          <h4 className="font-medium mb-2">Current Files</h4>
          {item.product?.files.length === 0 ? (
            <p className="text-gray-500">No files available</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {item.product?.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded">
                  <input
                    type="checkbox"
                    checked={filesToDelete.includes(file.id)}
                    onChange={() => toggleFileDelete(file.id)}
                    className="h-4 w-4"
                  />
                  <span className="flex-1">{file.fileName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {orderData.files.length > 0 && (
            <button
              onClick={handleDeleteFiles}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={filesToDelete.length === 0}
            >
              Delete Selected ({filesToDelete.length})
            </button>
          )}
        </div>
      </div>
    </div>
  )}
                </div>

                {/* Workflow Stages */}
                <div>
                  <h4 className="text-md font-medium text-[#111928] mb-2">Workflow Stages</h4>
                  <div className="space-y-2">
                    {item.product?.service?.workflow?.stages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="flex items-center gap-2 p-2 bg-white border border-[#e5e7eb] rounded-lg">
                        <span style={{ color: stage.color }}>⬤</span>
                        <p className="text-sm text-[#111928]">{stage.title}</p>
                        <p className="text-xs text-[#9ca3af]">{stage.days} days</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Order Files */}
    <div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-medium text-[#111928]">Order Files</h2>
    <button 
      onClick={() => setIsFilesModalOpen(true)}
      className="text-blue-600 hover:underline text-sm"
    >
      Edit
    </button>
  </div>
  
  {orderData.files.map((file, fileIndex) => {
    // Define isImage here for each file
    const isImage = ["jpg", "jpeg", "png"].includes(
      file.fileName.split('.').pop().toLowerCase()
    );
    
    return (
      <div key={fileIndex} className="flex items-center gap-2 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg mb-2">
        {getFileIcon(file.fileName.split('.').pop())}
        <p className="text-sm text-[#111928] flex-1">{file.fileName}</p>
        {isImage && (
          <button
            onClick={() => openImageViewer(file.filePath)}
            className="text-[#2563eb] text-sm hover:underline"
          >
            View Image
          </button>
        )}
        <p className="text-xs text-[#9ca3af]">
          Uploaded: {new Date(file.uploadedAt).toLocaleString()}
        </p>
      </div>
    );
  })}

  {/* Files Edit Modal */}
  {isFilesModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Manage Order Files</h3>
          <button 
            onClick={() => {
              setIsFilesModalOpen(false);
              setFilesToDelete([]);
              setNewFile(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Add File Section */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Add New File</h4>
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={handleAddFile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!newFile || uploadProgress > 0}
            >
              {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload'}
            </button>
          </div>
        </div>

        {/* Delete Files Section */}
        <div>
          <h4 className="font-medium mb-2">Current Files</h4>
          {orderData.files.length === 0 ? (
            <p className="text-gray-500">No files available</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orderData.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded">
                  <input
                    type="checkbox"
                    checked={filesToDelete.includes(file.id)}
                    onChange={() => toggleFileDelete(file.id)}
                    className="h-4 w-4"
                  />
                  <span className="flex-1">{file.fileName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {orderData.files.length > 0 && (
            <button
              onClick={handleDeleteFiles}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={filesToDelete.length === 0}
            >
              Delete Selected ({filesToDelete.length})
            </button>
          )}
        </div>
      </div>
    </div>
  )}
</div>

      {/* Comments Section */}
      <div>
        <h2 className="text-lg font-medium text-[#111928] mb-4">Comments</h2>
        <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] mb-6">
          <form onSubmit={handleAddComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111928] mb-1">Comment</label>
              <textarea
                name="commentText"
                value={newComment.commentText}
                onChange={handleCommentChange}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                placeholder="Enter your comment"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111928] mb-1">Author</label>
              <input
                type="text"
                name="commentBy"
                value={newComment.commentBy}
                onChange={handleCommentChange}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_internal"
                checked={newComment.is_internal}
                onChange={handleCommentChange}
                className="mr-2"
              />
              <label className="text-sm text-[#111928]">Internal Comment</label>
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Comment
            </button>
          </form>
        </div>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`p-4 rounded-lg border ${
                    comment.is_internal ? "bg-gray-100 border-gray-300" : "bg-white border-[#e5e7eb]"
                  }`}
                >
                  <p className="text-sm text-[#111928]">{comment.commentText}</p>
                  <p className="text-xs text-[#9ca3af]">
                    By: {comment.commentBy || "N/A"} on {new Date(comment.commentAt || comment.createdAt).toLocaleString()}
                    {comment.is_internal && " (Internal)"}
                  </p>
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                    <p className="text-xs text-[#9ca3af]">Updated: {new Date(comment.updatedAt).toLocaleString()}</p>
                  )}
                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {comment.replies.map((reply, replyIndex) => (
                      <div
                        key={replyIndex}
                        className={`p-4 rounded-lg border ${
                          reply.is_internal ? "bg-gray-200 border-gray-300" : "bg-white border-[#e5e7eb]"
                        }`}
                      >
                        <p className="text-sm text-[#111928]">{reply.commentText}</p>
                        <p className="text-xs text-[#9ca3af]">
                          By: {reply.commentBy || "N/A"} on {new Date(reply.commentAt || reply.createdAt).toLocaleString()}
                          {reply.is_internal && " (Internal)"}
                        </p>
                        {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                          <p className="text-xs text-[#9ca3af]">Updated: {new Date(reply.updatedAt).toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-[#9ca3af]">No comments available.</p>
          )}
        </div>
      </div>
      {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit Order Details</h3>
        <button 
          onClick={() => setIsEditModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Information */}
          <div>
            <h4 className="font-medium mb-2">Order Information</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedData.title}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Status</label>
                <select
                  name="status"
                  value={editedData.status}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="draft">Draft</option>
                  <option value="in progress">In Progress</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={editedData.startDate}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={editedData.dueDate}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Notes</label>
                <textarea
                  name="notes"
                  value={editedData.notes}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50" onClick={closeImageViewer}>
          <div className="relative">
            <img src={`https://printmanager-api.onrender.com${selectedImage}`} alt="Order File" className="max-h-[80vh] max-w-[80vw] object-contain" />
            <button
              onClick={closeImageViewer}
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
    </div>
  );
}