"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Custom Check Icon (from CreateProduct)
function CheckIcon({ className }) {
  return (
    <svg
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2355 0.812752L10.2452 0.824547C10.4585 1.08224 10.4617 1.48728 10.1855 1.74621L4.85633 7.09869C4.66442 7.29617 4.41535 7.4001 4.14693 7.4001C3.89823 7.4001 3.63296 7.29979 3.43735 7.09851L0.788615 4.43129C0.536589 4.1703 0.536617 3.758 0.788643 3.49701C1.04747 3.22897 1.4675 3.22816 1.72731 3.49457L4.16182 5.94608L9.28643 0.799032C9.54626 0.532887 9.96609 0.533789 10.2248 0.801737L10.2355 0.812752Z"
        fill=""
      />
    </svg>
  );
}

// Custom Checkbox (radio style for single select)
function CustomStageRadio({ label, checked, onChange, name }) {
  const id = React.useId();
  return (
    <div className="mb-2">
      <label htmlFor={id} className="flex cursor-pointer select-none items-center text-sm text-[#111928]">
        <div className="relative">
          <input
            type="radio"
            name={name}
            id={id}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
          />
          <div className="mr-2 flex size-5 items-center justify-center rounded border border-[#e5e7eb] peer-checked:border-[#5750f1] peer-checked:bg-[#f3f4f6] [&>*]:text-[#5750f1] peer-checked:[&>*]:block">
            <CheckIcon className="hidden text-[#5750f1]" />
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}

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
  const [sizeOptions, setSizeOptions] = useState([]);

  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [productId, setproductId] = useState("");
  const [comments, setComments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [itemActivityLogs, setItemActivityLogs] = useState([]);
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

  // --- COMMENT STATE for editing ---
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // For item comment form state
  const [itemNewComment, setItemNewComment] = useState({}); // { [itemId]: { commentText, is_internal } }
  const [itemEditingCommentId, setItemEditingCommentId] = useState({}); // { [itemId]: commentId }
  const [itemEditingCommentText, setItemEditingCommentText] = useState({}); // { [itemId]: text }
  const [deleteCommentModal, setDeleteCommentModal] = useState({ open: false, commentId: null });

  // Fetch size quantities when modal opens
//   const openSizeModal = async (orderItemId, productPrice) => {
//   setIsSizeModalOpen(true);
//   setCurrentOrderItemId(orderItemId); // Store the current order item ID

//   if (orderItemId) {
//     setNewSize(prev => ({
//       ...prev,
//       Price: productPrice || 40
//     }));

//     try {
//       const response = await axios.get(
//         `https://printmanager-api.onrender.com/api/sizeQuantities/${orderItemId}`
//       );
//       setSizeQuantities(response.data);
//     } catch (error) {
//       console.error("Error fetching sizes:", error);
//       toast.error("Failed to load size quantities");
//     }
//   } else {
//     setNewSize(prev => ({
//       ...prev,
//       Price: productPrice || 40
//     }));
//   }
// };

const handleAskApproval = async (fileId) => {
  try {
    const response = await fetch(`https://printmanager-api.onrender.com/api/customerApprovals/${fileId}`, {
      method: 'POST'
    });
    const data = await response.json();
    if (response.ok) {
      alert('Approval email sent successfully!');
    } else {
      alert(`Failed to send email: ${data.message}`);
    }
  } catch (err) {
    alert('Error sending approval request');
    console.error(err);
  }
};

const openSizeModal = async (orderItemId, productPrice, productId) => {
  setIsSizeModalOpen(true);
  setCurrentOrderItemId(orderItemId); // Store the current order item ID

  // Find the product associated with the order item
  const orderItem = orderData.items.find(item => item.id === orderItemId);
  const product = orderItem?.product;

  // Set size options from the product
  setSizeOptions(product?.sizeOptions || []);

  // Initialize newSize with the product's unit price
  setNewSize({
    Size: '',
    Price: productPrice || product?.unitPrice,
    Quantity: ''
  });

  try {
    const response = await axios.get(
      `https://printmanager-api.onrender.com/api/sizeQuantities/${orderItemId}`
    );
    setSizeQuantities(response.data);
  } catch (error) {
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
        createdBy: sessionStorage.getItem("username"),
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
        updatedBy:sessionStorage.getItem("username")
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
  formData.append('uploadedBy',sessionStorage.getItem("username") );

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
  formData.append('orderItemId', currentOrderItemId);
  formData.append('uploadedBy',sessionStorage.getItem("username"));

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

  useEffect(() => {
  async function fetchActivityLogs() {
    try {
      const logsRes = await fetch(`https://printmanager-api.onrender.com/api/activitylogs/order/${orderId}`);
      if (!logsRes.ok) throw new Error("Failed to fetch activity logs");
      const logsData = await logsRes.json();
      setActivityLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error(error.message || "Error loading activity logs");
    }
  }

  if (orderId) fetchActivityLogs();

  async function fetchItemActivityLogs() {
    try {
      const logsRes = await fetch(`https://printmanager-api.onrender.com/api/activitylogs/orderitem/${orderId}`);
      if (!logsRes.ok) throw new Error("Failed to fetch activity logs");
      const logsData = await logsRes.json();
      setItemActivityLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error(error.message || "Error loading activity logs");
    }
  }

  if (orderId) fetchItemActivityLogs();
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
    const { name, value } = e.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Internal/Public toggle
  const handleInternalToggle = (isInternal) => {
    setNewComment((prev) => ({
      ...prev,
      is_internal: isInternal,
    }));
  };

  // For item comment form
  const handleItemInternalToggle = (itemId, isInternal) => {
    setItemNewComment((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        is_internal: isInternal,
      },
    }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.commentText) {
      toast.error("Comment text is required");
      return;
    }
    try {
      const commentData = {
        orderId: parseInt(orderId),
        commentText: newComment.commentText,
        commentBy: sessionStorage.getItem("username") || "Anonymous",
        is_internal: newComment.is_internal,
        orderItemId: null,
      };
      const res = await fetch("https://printmanager-api.onrender.com/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const addedComment = await res.json();
      setComments((prev) => [...prev, addedComment]);
      setNewComment({ commentText: "", is_internal: false });
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Error adding comment");
    }
  };

  // For item comment form
  const handleItemCommentChange = (itemId, e) => {
    const { name, value } = e.target;
    setItemNewComment((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [name]: value,
      },
    }));
  };

  const handleAddItemComment = (itemId) => async (e) => {
    e.preventDefault();
    const commentText = itemNewComment[itemId]?.commentText;
    if (!commentText) {
      toast.error("Comment text is required");
      return;
    }
    try {
      const commentData = {
        orderId: parseInt(orderId),
        orderItemId: itemId,
        commentText,
        commentBy: sessionStorage.getItem("username") || "Anonymous",
        is_internal: itemNewComment[itemId]?.is_internal || false,
      };
      const res = await fetch("https://printmanager-api.onrender.com/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const addedComment = await res.json();
      setComments((prev) => [...prev, addedComment]);
      setItemNewComment((prev) => ({ ...prev, [itemId]: { commentText: "", is_internal: false } }));
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(error.message || "Error adding comment");
    }
  };

  // Edit for item comments
  const handleEditItemComment = (itemId, comment) => {
    setItemEditingCommentId((prev) => ({ ...prev, [itemId]: comment.id }));
    setItemEditingCommentText((prev) => ({ ...prev, [itemId]: comment.commentText }));
  };
  const handleEditItemCommentChange = (itemId, e) => {
    setItemEditingCommentText((prev) => ({ ...prev, [itemId]: e.target.value }));
  };
  const handleSaveEditItemComment = (itemId, comment) => async () => {
    try {
      const res = await fetch(`https://printmanager-api.onrender.com/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...comment,
          commentText: itemEditingCommentText[itemId],
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      const updatedComment = await res.json();
      setComments((prev) => prev.map((c) => (c.id === comment.id ? updatedComment : c)));
      setItemEditingCommentId((prev) => ({ ...prev, [itemId]: null }));
      setItemEditingCommentText((prev) => ({ ...prev, [itemId]: "" }));
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error(error.message || "Error updating comment");
    }
  };
  const handleCancelEditItemComment = (itemId) => {
    setItemEditingCommentId((prev) => ({ ...prev, [itemId]: null }));
    setItemEditingCommentText((prev) => ({ ...prev, [itemId]: "" }));
  };

  // Edit comment handlers
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.commentText);
  };

  const handleEditCommentChange = (e) => {
    setEditingCommentText(e.target.value);
  };

  const handleSaveEditComment = async (comment) => {
    try {
      const res = await fetch(`https://printmanager-api.onrender.com/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...comment,
          commentText: editingCommentText,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      const updatedComment = await res.json();
      setComments((prev) => prev.map((c) => (c.id === comment.id ? updatedComment : c)));
      setEditingCommentId(null);
      setEditingCommentText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error(error.message || "Error updating comment");
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Delete comment (order or item)
  const handleDeleteComment = (commentId) => {
    setDeleteCommentModal({ open: true, commentId });
  };

  const confirmDeleteComment = async () => {
    const commentId = deleteCommentModal.commentId;
    if (!commentId) return;
    try {
      const res = await fetch(`https://printmanager-api.onrender.com/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(error.message || "Error deleting comment");
    } finally {
      setDeleteCommentModal({ open: false, commentId: null });
    }
  };

  const cancelDeleteComment = () => {
    setDeleteCommentModal({ open: false, commentId: null });
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
        <div className="flex flex-col gap-4">
          {/* Left Sidebar - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg border border-[#e5e7eb]">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">First Name</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.firstName || "N/A"}</h5>
                </div>
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">Last Name</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.lastName || "N/A"}</h5>
                </div>
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">Email</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.email || "N/A"}</h5>
                </div>
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">Mobile</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.mobile || "N/A"}</h5>
                </div>
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">Company</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.company || "N/A"}</h5>
                </div>
                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                  <h5 className="font-bold text-[#111928] text-[16px]">Address</h5>
                  <h5 className="text-[#6b7280] text-[15px]">{orderData.customer.address || "N/A"}</h5>
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
                      <div>
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
                          {/* className="border border-[#e5e7eb] px-5 py-4 bg-white" */}

                          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                              <h5 className="font-bold text-[#111928] text-[16px]">Title:</h5>
                              <h5 className="text-[#6b7280] text-[15px]">{orderData.title || "N/A"}</h5>
                            </div>
                            <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                              <h5 className="font-bold text-[#111928] text-[16px]">Start Date:</h5>
                              <h5 className="text-[#6b7280] text-[15px]">{new Date(orderData.startDate).toLocaleDateString() || "N/A"}</h5>
                            </div>
                            <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                              <h5 className="font-bold text-[#111928] text-[16px]">Due Date:</h5>
                              <h5 className="text-[#6b7280] text-[15px]">{new Date(orderData.dueDate).toLocaleDateString() || "N/A"}</h5>
                            </div>
                            <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                              <h5 className="font-bold text-[#111928] text-[16px]">Notes:</h5>
                              <h5 className="text-[#6b7280] text-[15px]">{orderData.notes || "N/A"}</h5>
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
                      <div key={item.id} className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
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
                          <div className="p-6 bg-white">
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
                              <div className="flex flex-col gap-4">
                              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Product:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.product?.title || "N/A"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Color:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.color || "N/A"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Quantity:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.quantity || "N/A"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Price:</h5> <h5 className="text-[#6b7280] text-[15px]">${item.price || "0"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Service:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.product?.service?.title || "N/A"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Workflow:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.product?.service?.workflow?.title || "N/A"}</h5></div>
                                <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Current Stage:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.currentStage || "N/A"}</h5></div>
                                {/* Stage Change Radio Buttons */}
                                {item.product?.service?.workflow?.stages && (
                                  <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2">
                                    <h5 className="font-bold text-[#111928] text-[16px]">Change Stage:</h5>
                                    <div className="flex flex-wrap gap-4">
                                      {item.product?.service?.workflow?.stages.map((stage, idx) => (
                                        <CustomStageRadio
                                          key={idx}
                                          label={stage.title}
                                          checked={item.currentStage === stage.title}
                                          name={`stage-${item.id}`}
                                          onChange={async () => {
                                            const newStage = stage.title;
                                            try {
                                              await axios.put(`https://printmanager-api.onrender.com/api/orderItems/${item.id}`, {
                                                currentStage: newStage,
                                                updatedBy: sessionStorage.getItem("username"),
                                              });
                                              setOrderData(prev => ({
                                                ...prev,
                                                items: prev.items.map(itm =>
                                                  itm.id === item.id ? { ...itm, currentStage: newStage } : itm
                                                )
                                              }));
                                              toast.success("Stage updated successfully");
                                            } catch (error) {
                                              toast.error("Failed to update stage");
                                            }
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                                {/* Size Quantities */}
                                <div className="md:col-span-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <h5 className="font-medium text-gray-900">Size Quantities</h5>
                                    <button
                                      onClick={() => {
                                        openSizeModal(item.id, item.product.unitPrice, item.product.id);
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
                                        setSizeOptions([]); // Reset size options when closing
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
                                          <select
                                            name="Size"
                                            value={editingSize?.Size || newSize.Size}
                                            onChange={handleSizeChange}
                                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                                          >
                                            <option value="">Select Size</option>
                                            {sizeOptions.map((size, i) => (
                                              <option key={i} value={size}>
                                                {size}
                                              </option>
                                            ))}
                                          </select>
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
                                      <div
                                        key={stageIndex}
                                        className="flex items-center gap-3 border border-[#e5e7eb] px-5 py-4"
                                      >
                                        <span
                                          className="h-3 w-3 rounded-full"
                                          style={{ backgroundColor: stage.color }}
                                        ></span>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">{stage.title}</p>
                                          <p className="text-xs text-gray-500">{stage.days} days</p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {stage.title === item.currentStage ? "Current" : ""}
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
                                      setCurrentOrderItemId(item.id)
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Files
                                  </button>
                                </div>
                                {item.product.files.length > 0 ? (
                                  <div className="space-y-2">
                                    {item.files.map((file, fileIndex) => {
                                      const isImage = ["jpg", "jpeg", "png"].includes(
                                        file.fileName.split('.').pop().toLowerCase()
                                      );
                                      return (
                                        <div key={fileIndex} className="flex items-center gap-3 border border-[#e5e7eb] px-5 py-4">
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
                              <div className="flex flex-col gap-3">
                                <h5 className="font-medium text-gray-900 mb-2">Item Comments</h5>
                                <p className="text-sm text-gray-500 mb-4">Comments specific to this order item.</p>
                                {/* Item Comments List as chat bubbles */}
                                <div className="space-y-4">
                                  {comments.filter(c => c.orderItemId === item.id).length > 0 ? (
                                    comments.filter(c => c.orderItemId === item.id).map((comment, index) => {
                                      const isOwn = comment.commentBy === (sessionStorage.getItem("username") || "Anonymous");
                                      const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
                                      return (
                                        <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-lg w-fit p-4 rounded-2xl shadow border relative ${comment.is_internal ? 'bg-purple-50 border-purple-200' : 'bg-indigo-50 border-indigo-200'} ${isOwn ? 'ml-16' : 'mr-16'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className={`text-xs font-semibold ${comment.is_internal ? 'text-purple-700' : 'text-indigo-700'}`}>{comment.is_internal ? 'Internal' : 'Public'}</span>
                                              <span className="text-xs text-gray-500">{comment.commentBy || "Anonymous"}</span>
                                            </div>
                                            {itemEditingCommentId[item.id] === comment.id ? (
                                              <>
                                                <input
                                                  value={itemEditingCommentText[item.id]}
                                                  onChange={(e) => handleEditItemCommentChange(item.id, e)}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                  <button type="button" onClick={handleSaveEditItemComment(item.id, comment)} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs">Save</button>
                                                  <button type="button" onClick={() => handleCancelEditItemComment(item.id)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs">Cancel</button>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <p className="text-sm text-gray-800 whitespace-pre-line">{comment.commentText}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                  <span className="text-xs text-gray-500">{new Date(comment.commentAt || comment.createdAt).toLocaleString()}</span>
                                                  {isEdited && <span className="text-xs text-gray-400">Edited</span>}
                                                  {isOwn && (
                                                    <>
                                                      <button type="button" onClick={() => handleEditItemComment(item.id, comment)} className="ml-2 text-xs text-indigo-600 hover:underline">Edit</button>
                                                      <button type="button" onClick={() => handleDeleteComment(comment.id)} className="ml-2 text-xs text-red-600 hover:underline">Delete</button>
                                                    </>
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="bg-white p-6 border border-[#e5e7eb] text-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                      </svg>
                                      <h4 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h4>
                                      <p className="mt-1 text-sm text-gray-500">Be the first to add a comment.</p>
                                    </div>
                                  )}
                                </div>
                                {/* Add Item Comment Form */}
                                <div className="bg-white p-6 border border-[#e5e7eb] mb-6">
                                  <form onSubmit={handleAddItemComment(item.id)} className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                                      <input
                                        name="commentText"
                                        value={itemNewComment[item.id]?.commentText || ""}
                                        onChange={(e) => handleItemCommentChange(item.id, e)}
                                         className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                                        placeholder="Enter your comment"
                                        required
                                      />
                                    </div>
                                    <div className="flex gap-4 items-center">
                                      <span className="text-sm font-medium text-gray-700">Type:</span>
                                      <button
                                        type="button"
                                        onClick={() => handleItemInternalToggle(item.id, false)}
                                        className={`px-4 py-2 rounded-md border text-sm font-medium focus:outline-none ${!itemNewComment[item.id]?.is_internal ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                                      >
                                        Public
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleItemInternalToggle(item.id, true)}
                                        className={`px-4 py-2 rounded-md border text-sm font-medium focus:outline-none ${itemNewComment[item.id]?.is_internal ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                                      >
                                        Internal
                                      </button>
                                    </div>
                                    <button
                                      type="submit"
                                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                      Post Comment
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}

                            {activeItemTab === "activity" && (
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
                                <div>
                                  {itemActivityLogs.length === 0 ? (
                                    <p className="text-gray-500">No activity logs found.</p>
                                  ) : (
                                    <ul className="flex flex-col gap-3">
                                      {itemActivityLogs.map((log) => (
                                        <li key={log.id} className="border border-[#e5e7eb] px-5 py-4 bg-white">
                                          <p className="text-sm text-gray-800">
                                            <strong>{log.action}</strong> by <span className="text-blue-600">{log.performedBy}</span>
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                          </p>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
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
                           <div key={fileIndex} className="flex items-center gap-3 p-3 border border-[#e5e7eb] px-5 py-4">
  {getFileIcon(file.fileName.split('.').pop())}
  <div className="flex-1">
    <p className="text-sm text-gray-900">{file.fileName}</p>
    <p className="text-xs text-gray-500">
      Uploaded: {new Date(file.uploadedAt).toLocaleString()}
    </p>
  </div>

  {/* Status badge */}
  {file.status && (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        file.status === "Approved"
          ? "bg-green-100 text-green-700"
          : file.status === "Rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {file.status}
    </span>
    
  )}

  <button
      onClick={() => handleAskApproval(file.id,orderData.token,orderData.customer.email)}
      className="text-xs text-indigo-600 hover:text-indigo-800"
    >
      Ask Approval
    </button>

  {/* View button for images */}
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
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Comments</h3>
                    {/* Comments List as chat bubbles */}
                    <div className="space-y-4">
                      {comments.filter(c => c.orderItemId == null).length > 0 ? (
                        comments.filter(c => c.orderItemId == null).map((comment, index) => {
                          const isOwn = comment.commentBy === (sessionStorage.getItem("username") || "Anonymous");
                          const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
                          return (
                            <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-lg w-fit p-4 rounded-2xl shadow border relative ${comment.is_internal ? 'bg-purple-50 border-purple-200' : 'bg-indigo-50 border-indigo-200'} ${isOwn ? 'ml-16' : 'mr-16'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-semibold ${comment.is_internal ? 'text-purple-700' : 'text-indigo-700'}`}>{comment.is_internal ? 'Internal' : 'Public'}</span>
                                  <span className="text-xs text-gray-500">{comment.commentBy || "Anonymous"}</span>
                                </div>
                                {editingCommentId === comment.id ? (
                                  <>
                                    <input
                                      value={editingCommentText}
                                      onChange={handleEditCommentChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button type="button" onClick={() => handleSaveEditComment(comment)} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs">Save</button>
                                      <button type="button" onClick={handleCancelEditComment} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs">Cancel</button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm text-gray-800 whitespace-pre-line">{comment.commentText}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-gray-500">{new Date(comment.commentAt || comment.createdAt).toLocaleString()}</span>
                                      {isEdited && <span className="text-xs text-gray-400">Edited</span>}
                                      {isOwn && (
                                        <>
                                          <button type="button" onClick={() => handleEditComment(comment)} className="ml-2 text-xs text-indigo-600 hover:underline">Edit</button>
                                          <button type="button" onClick={() => handleDeleteComment(comment.id)} className="ml-2 text-xs text-red-600 hover:underline">Delete</button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-white p-6 border border-[#e5e7eb] text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <h4 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h4>
                          <p className="mt-1 text-sm text-gray-500">Be the first to add a comment.</p>
                        </div>
                      )}
                    </div>
                    {/* Add Comment Form */}
                    <div className="bg-white p-6 border border-[#e5e7eb] mb-6">
                      <form onSubmit={handleAddComment} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                          <input
                            name="commentText"
                            value={newComment.commentText}
                            onChange={handleCommentChange}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
                            placeholder="Enter your comment"
                            required
                          />
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm font-medium text-gray-700">Type:</span>
                          <button
                            type="button"
                            onClick={() => handleInternalToggle(false)}
                            className={`px-4 py-2 rounded-md border text-sm font-medium focus:outline-none ${!newComment.is_internal ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            Public
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInternalToggle(true)}
                            className={`px-4 py-2 rounded-md border text-sm font-medium focus:outline-none ${newComment.is_internal ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            Internal
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Post Comment
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "logs" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
                    <div>
                      {activityLogs.length === 0 ? (
                        <p className="text-gray-500">No activity logs found.</p>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {activityLogs.map((log) => (
                            <li key={log.id} className="border border-[#e5e7eb] px-5 py-4 bg-white">
                              <p className="text-sm text-gray-800">
                                <strong>{log.action}</strong> by <span className="text-blue-600">{log.performedBy}</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleString()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
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

      {/* Delete Comment Modal */}
      {deleteCommentModal.open && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-[400px] shadow-xl">
            <h2 className="text-xl font-bold text-[#111928] mb-4">Confirm Delete</h2>
            <p className="text-sm text-[#111928] mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDeleteComment}
                className="py-[10px] px-6 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteComment}
                className="py-[10px] px-6 bg-[#ef4444] text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
}