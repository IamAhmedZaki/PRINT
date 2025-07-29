"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
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
    updatedBy:"",
  });
  const { orderId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeItemTab, setActiveItemTab] = useState("details");

  const fetchData = async () => {
    const response = await fetch(`https://printmanager-api.onrender.com/api/orders/${orderId}`);
    const data = await response.json();
    return data.items.map((item => {
      return (
        item.product.id
      )
    }));
  };

  // Usage
  fetchData().then(items => {
    console.log(items);
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
  setCurrentOrderItemId(orderItemId); // Store the current order item ID

  if (orderItemId) {
    setNewSize(prev => ({
      ...prev,
      Price: productPrice || 40
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
  } else {
    setNewSize(prev => ({
      ...prev,
      Price: productPrice || 40
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
        createdBy: "User Name",
        Price: parseFloat(newSize.Price),
        Quantity: parseInt(newSize.Quantity),
      }
    );

    // Update local state immediately
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === currentOrderItemId
          ? {
              ...item,
              sizeQuantities: [...item.sizeQuantities, response.data]
            }
          : item
      )
    }));

    setNewSize({ Size: '', Price: '', Quantity: '' });
    toast.success("Size added successfully");
  } catch (error) {
    console.error("Error adding size:", error);
    toast.error("Failed to add size");
  }
};

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

    // Update local state immediately
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === currentOrderItemId
          ? {
              ...item,
              sizeQuantities: item.sizeQuantities.map(size => 
                size.id === editingSize.id ? response.data : size
              )
            }
          : item
      )
    }));

    setEditingSize(null);
    toast.success("Size updated successfully");
  } catch (error) {
    console.error("Error updating size:", error);
    toast.error("Failed to update size");
  }
};

const handleDeleteSize = async (sizeId) => {
  try {
    await axios.delete(
      `https://printmanager-api.onrender.com/api/sizeQuantities/${sizeId}`
    );

    // Update local state immediately
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === currentOrderItemId
          ? {
              ...item,
              sizeQuantities: item.sizeQuantities.filter(size => size.id !== sizeId)
            }
          : item
      )
    }));

    toast.success("Size deleted successfully");
    setIsSizeModalOpen(false);
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

  // For Order Files
const handleAddFile = async () => {
  if (!newFile) {
    toast.error("Please select a file first");
    return;
  }

  const formData = new FormData();
  formData.append('file', newFile);
  formData.append('orderId', orderId);
  formData.append('uploadedBy', "User Name");

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

    // Update local state immediately
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

// For Product Files
const handleAddFileProduct = async () => {
  if (!newFile || !currentProductId) {
    toast.error("Please select a file and ensure product is selected");
    return;
  }

  const formData = new FormData();
  formData.append('file', newFile);
  formData.append('productId', currentProductId);
  formData.append('uploadedBy', "User Name");

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

    // Update local state immediately
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

    // Update local state immediately - handles both order files and product files
    setOrderData(prev => {
      // Check if we're deleting order files or product files
      const isProductFile = prev.items.some(item => 
        item.product?.files?.some(f => filesToDelete.includes(f.id))
      );

      if (isProductFile) {
        // Product files deletion
        return {
          ...prev,
          items: prev.items.map(item => ({
            ...item,
            product: {
              ...item.product,
              files: item.product.files?.filter(file => !filesToDelete.includes(file.id)) || []
            }
          }))
        };
      } else {
        // Order files deletion
        return {
          ...prev,
          files: prev.files.filter(file => !filesToDelete.includes(file.id))
        };
      }
    });

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
      startDate: orderData.startDate.split('T')[0],
      dueDate: orderData.dueDate.split('T')[0],
      notes: orderData.notes,
      updatedBy: sessionStorage.getItem("username"),
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

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
        const orderRes = await fetch(`https://printmanager-api.onrender.com/api/orders/${orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order");
        const data = await orderRes.json();
        setOrderData(data);
        if (data.items) {
          setIsItemCollapsed(
            data.items.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
          );
        }

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
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-6 rounded-lg bg-white border border-[#e5e7eb]">
          <button
            onClick={() => router.push("/dashboard/order/list")}
            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Orders
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-gray-800 text-2xl">Order No: {orderData.orderNumber}</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
            {orderData.status || "N/A"}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{orderData.customer.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{orderData.customer.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mobile</p>
                  <p className="font-medium">{orderData.customer.mobile || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">{orderData.customer.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{orderData.customer.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg border border-[#e5e7eb]">
              <nav className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-6 text-sm font-medium ${activeTab === "overview" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("items")}
                  className={`py-4 px-6 text-sm font-medium ${activeTab === "items" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Order Items
                </button>
                <button
                  onClick={() => setActiveTab("files")}
                  className={`py-4 px-6 text-sm font-medium ${activeTab === "files" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Files
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`py-4 px-6 text-sm font-medium ${activeTab === "comments" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`py-4 px-6 text-sm font-medium ${activeTab === "logs" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Activity Log
                </button>
              </nav>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Overview</h3>
                      <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
                          <div className="flex justify-end items-center mb-4">
                            <button
                              onClick={openEditModal}
                              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Title</p>
                              <p className="font-medium">{orderData.title || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium">{new Date(orderData.startDate).toLocaleDateString() || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className="font-medium">{new Date(orderData.dueDate).toLocaleDateString() || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Notes</p>
                              <p className="font-medium">{orderData.notes || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                    </div>
                )}

                {activeTab === "items" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                      <span className="text-sm text-gray-500">{orderData.items.length} items</span>
                    </div>

                    {orderData.items.map((item, itemIndex) => (
                      <div key={item.id} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="flex justify-between items-center p-6 cursor-pointer"
                          onClick={() => toggleItemCollapse(itemIndex)}
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">Item #{itemIndex + 1} - {item.product?.title || "N/A"}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity} | Price: ${item.price}</p>
                          </div>
                          <span className="w-[35px] h-[35px] rounded-full flex justify-center items-center text-[20px] font-normal border-[2px] border-[#5750f1] text-[#5750f1]">{isItemCollapsed[itemIndex] ? '+' : '−'}</span>
                        </div>

                        {!isItemCollapsed[itemIndex] && (
                          <div className="p-4 bg-white">
                            <nav className="flex border-b border-gray-200 mb-4">
                              <button
                                onClick={() => setActiveItemTab("details")}
                                className={`py-2 px-4 text-sm font-medium ${activeItemTab === "details" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Details
                              </button>
                              <button
                                onClick={() => setActiveItemTab("workflow")}
                                className={`py-2 px-4 text-sm font-medium ${activeItemTab === "workflow" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Workflow
                              </button>
                              <button
                                onClick={() => setActiveItemTab("files")}
                                className={`py-2 px-4 text-sm font-medium ${activeItemTab === "files" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Files
                              </button>
                              <button
                                onClick={() => setActiveItemTab("comments")}
                                className={`py-2 px-4 text-sm font-medium ${activeItemTab === "comments" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Comments
                              </button>
                              <button
                                onClick={() => setActiveItemTab("activity")}
                                className={`py-2 px-4 text-sm font-medium ${activeItemTab === "activity" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Activity Log
                              </button>
                            </nav>

                            {activeItemTab === "details" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Product Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Product:</span> {item.product?.title || "N/A"}</p>
                                    <p><span className="text-gray-500">Color:</span> {item.color || "N/A"}</p>
                                    <p><span className="text-gray-500">Quantity:</span> {item.quantity || "N/A"}</p>
                                    <p><span className="text-gray-500">Price:</span> ${item.price || "0.00"}</p>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Service Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Service:</span> {item.product?.service?.title || "N/A"}</p>
                                    <p><span className="text-gray-500">Workflow:</span> {item.product?.service?.workflow?.title || "N/A"}</p>
                                    <p><span className="text-gray-500">Current Stage:</span> {item.currentStage || "N/A"}</p>
                                  </div>
                                </div>

                                {/* Size Quantities */}
                                <div className="md:col-span-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <h5 className="font-medium text-gray-900">Size Quantities</h5>
                                    <button
                                      onClick={() => {
                                        openSizeModal(item.sizeQuantities.id, item.product.unitPrice);
                                        setCurrentOrderItemId(item.id);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit Sizes
                                    </button>
                                  </div>
                                  {item.sizeQuantities.length > 0 ? (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {item.sizeQuantities.map((size, sizeIndex) => (
                                            <tr key={sizeIndex}>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{size.Size || "N/A"}</td>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${size.Price || "0.00"}</td>
                                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{size.Quantity || "0"}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No size quantities available</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {isSizeModalOpen && (
                              <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                                  <div className="flex justify-between items-center border-b border-gray-200 p-4">
                                    <h3 className="text-lg font-medium text-gray-900">Manage Size Quantities</h3>
                                    <button
                                      onClick={() => {
                                        setIsSizeModalOpen(false);
                                        setEditingSize(null);
                                      }}
                                      className="text-gray-400 hover:text-gray-500"
                                    >
                                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>

                                  <div className="p-6">
                                    {/* Add/Edit Form */}
                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-medium text-gray-900 mb-3">
                                        {editingSize ? 'Edit Size' : 'Add New Size'}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                          <input
                                            type="text"
                                            name="Size"
                                            value={editingSize?.Size || newSize.Size}
                                            onChange={handleSizeChange}
                                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                                            placeholder="e.g., S, M, L"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                          <input
                                            type="number"
                                            name="Price"
                                            value={editingSize?.Price || newSize.Price}
                                            onChange={handleSizeChange}
                                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-gray-100"
                                            placeholder={newSize.Price || "0.00"}
                                            step="0.01"
                                            readOnly
                                            disabled
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                          <input
                                            type="number"
                                            name="Quantity"
                                            value={editingSize?.Quantity || newSize.Quantity}
                                            onChange={handleSizeChange}
                                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex justify-end mt-4 space-x-3">
                                        {editingSize ? (
                                          <>
                                            <button
                                              onClick={() => setEditingSize(null)}
                                              className="py-[13px] px-6 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={handleUpdateSize}
                                              className="py-3 px-8 bg-[#5750f1] text-white rounded-lg flex items-center"
                                            >
                                              Update Size
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            onClick={handleAddSize}
                                            className="py-3 px-8 bg-[#5750f1] text-white rounded-lg flex items-center"
                                          >
                                            Add Size
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Size Quantities List */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3">Current Sizes</h4>
                                      {orderData.items.find(item => item.id === currentOrderItemId)?.sizeQuantities?.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No sizes available</p>
                                      ) : (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                          <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {orderData.items.find(item => item.id === currentOrderItemId)?.sizeQuantities?.map((size) => (
                                                <tr key={size.id}>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{size.Size}</td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${size.Price}</td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{size.Quantity}</td>
                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex space-x-2">
                                                      <button
                                                        onClick={() => setEditingSize(size)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                      >
                                                        Edit
                                                      </button>
                                                      <button
                                                        onClick={() => handleDeleteSize(size.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                      >
                                                        Delete
                                                      </button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeItemTab === "workflow" && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Workflow Stages</h5>
                                <div className="space-y-2">
                                  {item.product?.service?.workflow?.stages.map((stage, stageIndex) => (
                                    <div key={stageIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }}></span>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{stage.title}</p>
                                        <p className="text-xs text-gray-500">{stage.days} days</p>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {stageIndex === 0 ? "Current" : ""}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeItemTab === "files" && (
                              <div>
                                <div className="flex justify-between items-center mb-4">
                                  <h5 className="font-medium text-gray-900">Product Files</h5>
                                  <button
                                    onClick={() => {
                                      setIsFilesModalOpenProduct(true);
                                      setCurrentProductId(item.product.id);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Files
                                  </button>
                                </div>
                                {item.product?.files.length > 0 ? (
                                  <div className="space-y-2">
                                    {item.product?.files.map((file, fileIndex) => {
                                      const isImage = ["jpg", "jpeg", "png"].includes(
                                        file.fileName.split('.').pop().toLowerCase()
                                      );
                                      return (
                                        <div key={fileIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                          {getFileIcon(file.fileName.split('.').pop())}
                                          <div className="flex-1">
                                            <p className="text-sm text-gray-900">{file.fileName}</p>
                                            <p className="text-xs text-gray-500">
                                              Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                                            </p>
                                          </div>
                                          {isImage && (
                                            <button
                                              onClick={() => openImageViewer(file.filePath)}
                                              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                              </svg>
                                              View
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No files available for this product</p>
                                )}
                              </div>
                            )}

                            {activeItemTab === "comments" && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Item Comments</h5>
                                <p className="text-sm text-gray-500">Comments specific to this order item.</p>
                              </div>
                            )}

                            {activeItemTab === "activity" && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Item Activity Log</h5>
                                <p className="text-sm text-gray-500">Activity log for this order item.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "files" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Order Files</h3>
                      <button
                        onClick={() => setIsFilesModalOpen(true)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Files
                      </button>
                    </div>

                    {orderData.files.length > 0 ? (
                      <div className="space-y-2">
                        {orderData.files.map((file, fileIndex) => {
                          const isImage = ["jpg", "jpeg", "png"].includes(
                            file.fileName.split('.').pop().toLowerCase()
                          );
                          return (
                            <div key={fileIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              {getFileIcon(file.fileName.split('.').pop())}
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{file.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                                </p>
                              </div>
                              {isImage && (
                                <button
                                  onClick={() => openImageViewer(file.filePath)}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h4>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first file.</p>
                        <button
                          onClick={() => setIsFilesModalOpen(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Upload Files
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "comments" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
                    
                    {/* Add Comment Form */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                      <form onSubmit={handleAddComment} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                          <textarea
                            name="commentText"
                            value={newComment.commentText}
                            onChange={handleCommentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your comment"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                              type="text"
                              name="commentBy"
                              value={newComment.commentBy}
                              onChange={handleCommentChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_internal"
                              checked={newComment.is_internal}
                              onChange={handleCommentChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Internal Comment</label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <div key={index} className="space-y-2">
                            <div
                              className={`p-4 rounded-lg border ${comment.is_internal ? "bg-purple-50 border-purple-200" : "bg-white border-gray-200"}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{comment.commentBy || "Anonymous"}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.commentAt || comment.createdAt).toLocaleString()}
                                    {comment.is_internal && " • Internal"}
                                  </p>
                                </div>
                                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                  <span className="text-xs text-gray-400">Edited</span>
                                )}
                              </div>
                              <p className="mt-2 text-sm text-gray-700">{comment.commentText}</p>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-8 space-y-2">
                                {comment.replies.map((reply, replyIndex) => (
                                  <div
                                    key={replyIndex}
                                    className={`p-3 rounded-lg border ${reply.is_internal ? "bg-purple-50 border-purple-200" : "bg-white border-gray-200"}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{reply.commentBy || "Anonymous"}</p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(reply.commentAt || reply.createdAt).toLocaleString()}
                                          {reply.is_internal && " • Internal"}
                                        </p>
                                      </div>
                                      {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                                        <span className="text-xs text-gray-400">Edited</span>
                                      )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700">{reply.commentText}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <h4 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h4>
                          <p className="mt-1 text-sm text-gray-500">Be the first to add a comment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "logs" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">Here you can see all the activity logs for this order.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Modal */}
      

      {/* Files Modal */}
      {isFilesModalOpen && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Order Files</h3>
              <button
                onClick={() => {
                  setIsFilesModalOpen(false);
                  setFilesToDelete([]);
                  setNewFile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Add File Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Add New File</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <button
                    onClick={handleAddFile}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={!newFile || uploadProgress > 0}
                  >
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload'}
                  </button>
                </div>
              </div>

              {/* Delete Files Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Files</h4>
                {orderData.files.length === 0 ? (
                  <p className="text-gray-500 text-sm">No files available</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {orderData.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filesToDelete.includes(file.id)}
                          onChange={() => toggleFileDelete(file.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {orderData.files.length > 0 && (
                  <button
                    onClick={handleDeleteFiles}
                    className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={filesToDelete.length === 0}
                  >
                    Delete Selected ({filesToDelete.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Files Modal */}
      {isFilesModalOpenProduct && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Product Files</h3>
              <button
                onClick={() => {
                  setIsFilesModalOpenProduct(false);
                  setFilesToDelete([]);
                  setNewFile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Add File Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Add New File</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <button
                    onClick={handleAddFileProduct}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={!newFile || uploadProgress > 0}
                  >
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload'}
                  </button>
                </div>
              </div>

              {/* Delete Files Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Files</h4>
                {orderData.items.find(item => item.product.id === currentProductId)?.product?.files?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No files available</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {orderData.items.find(item => item.product.id === currentProductId)?.product?.files?.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filesToDelete.includes(file.id)}
                          onChange={() => toggleFileDelete(file.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {orderData.items.find(item => item.product.id === currentProductId)?.product?.files?.length > 0 && (
                  <button
                    onClick={handleDeleteFiles}
                    className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={filesToDelete.length === 0}
                  >
                    Delete Selected ({filesToDelete.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Order Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editedData.title}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={editedData.status}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                      >
                          <option value="draft">Draft</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editedData.startDate}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={editedData.dueDate}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <textarea
                    name="notes"
                    value={editedData.notes}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                    rows="5"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-[13px] px-6 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-8 bg-[#5750f1] text-white rounded-lg flex items-center"
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
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeImageViewer}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-2 rounded-lg">
              <img 
                src={`https://printmanager-api.onrender.com${selectedImage}`} 
                alt="Order File" 
                className="max-h-[80vh] max-w-full object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
}