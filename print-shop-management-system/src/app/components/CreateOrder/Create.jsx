"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateOrder() {
  const router = useRouter();
  const [orderData, setOrderData] = useState({
    customerId: '',
    customerName: '',
    // orderNumber: '',
    title: '',
    status: 'Draft',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [],
    total: 0,
    totalQuantity: 0,
    files: [],
    createdBy:''
  });
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [serviceDropdowns, setServiceDropdowns] = useState({});
  const fileInputRefs = useRef([]);
  const [fileInputs, setFileInputs] = useState([0]);
  const [isItemCollapsed, setIsItemCollapsed] = useState({});

  // Generate order number
  // useEffect(() => {
  //   const generateOrderNumber = () => {
  //     const randomNum = Math.floor(1000 + Math.random() * 9000);
  //     setOrderData(prev => ({ ...prev, orderNumber: `OR#${randomNum}` }));
  //   };
  //   generateOrderNumber();
  // }, []);

  // Fetch customers, products, and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersRes = await fetch('https://printmanager-api.onrender.com/api/customers');
        if (!customersRes.ok) throw new Error('Failed to fetch customers');
        const customersData = await customersRes.json();
        setCustomers(Array.isArray(customersData) ? customersData : customersData.customers || []);

        const productsRes = await fetch('https://printmanager-api.onrender.com/api/products');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData) ? productsData : productsData.products || []);

        const servicesRes = await fetch('https://printmanager-api.onrender.com/api/services');
        if (!servicesRes.ok) throw new Error('Failed to fetch services');
        const servicesData = await servicesRes.json();
        setServices(Array.isArray(servicesData) ? servicesData : servicesData.services || []);
      } catch (err) {
        toast.error(err.message || 'Error fetching data');
      }
    };
    fetchData();
  }, []);

  // Handle customer search
  const handleCustomerSearch = (searchTerm) => {
    if (searchTerm.length < 3) {
      setCustomerSearchResults([]);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const results = customers.filter(customer =>
      customer.id.toString().includes(searchTerm) ||
      (customer.firstName && customer.firstName.toLowerCase().includes(lowerSearch)) ||
      (customer.lastName && customer.lastName.toLowerCase().includes(lowerSearch)) ||
      (customer.company && customer.company.toLowerCase().includes(lowerSearch)) ||
      (customer.email && customer.email.toLowerCase().includes(lowerSearch)) ||
      (customer.mobile && customer.mobile.toLowerCase().includes(lowerSearch))
    );
    setCustomerSearchResults(results.slice(0, 10));
  };

  // Handle customer selection
  const selectCustomer = async (customer) => {
    try {
      const res = await fetch(`https://printmanager-api.onrender.com/api/customers/${customer.id}`);
      if (!res.ok) throw new Error('Customer not found');
      const data = await res.json();
      setCustomerInfo(data);
      setOrderData(prev => ({ ...prev, customerId: customer.id.toString(), customerName: customer.name }));
      setCustomerSearchResults([]);
    } catch (err) {
      toast.error(err.message || 'Error fetching customer');
      setCustomerInfo(null);
    }
  };

  // Handle product search
  const handleProductSearch = (searchTerm, itemIndex) => {
    if (searchTerm.length < 3) {
      setProductSearchResults(prev => ({ ...prev, [itemIndex]: [] }));
      setServiceDropdowns(prev => ({ ...prev, [itemIndex]: {} }));
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const results = products.filter(product => {
      const service = services.find(s => s.id === product.serviceId);
      const serviceTitle = service?.title || '';
      return (
        product.id.toString().includes(searchTerm) ||
        (product.title && product.title.toLowerCase().includes(lowerSearch)) ||
        (serviceTitle && serviceTitle.toLowerCase().includes(lowerSearch))
      );
    });
    
    // Group products by service
    const groupedByService = results.reduce((acc, product) => {
      const serviceId = product.serviceId;
      const serviceTitle = services.find(s => s.id === serviceId)?.title || 'Unknown';
      if (!acc[serviceId]) {
        acc[serviceId] = { title: serviceTitle, products: [] };
      }
      acc[serviceId].products.push(product);
      return acc;
    }, {});

    setProductSearchResults(prev => ({
      ...prev,
      [itemIndex]: Object.values(groupedByService)
    }));
  };

  // Toggle service dropdown
  const toggleServiceDropdown = (itemIndex, serviceId) => {
    setServiceDropdowns(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [serviceId]: !prev[itemIndex]?.[serviceId]
      }
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      setOrderData(prev => ({ ...prev, customerName: value }));
      handleCustomerSearch(value);
    } else {
      setOrderData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle file upload
  const handleFileChange = (e, index) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
      }
      setOrderData(prev => {
        const newFiles = [...prev.files];
        newFiles[index] = files[0];
        return { ...prev, files: newFiles };
      });
    }
  };

  // Add new file input
  const addFileInput = () => {
    setFileInputs(prev => [...prev, prev.length]);
  };

  // Remove file input
  const removeFileInput = (index) => {
    if (fileInputs.length > 1) {
      setFileInputs(prev => prev.filter((_, i) => i !== index));
      setOrderData(prev => {
        const newFiles = prev.files.filter((_, i) => i !== index);
        return { ...prev, files: newFiles };
      });
    }
  };

  // Add new item
  const addItem = () => {
    setOrderData(prev => {
      const newItems = [...prev.items, {
        productId: '',
        color: '',
        size: '',
        sizeQuantities: [],
        productTitle: '',
        serviceTitle: '',
        image: '',
        total: 0,
        quantity: 0
      }];
      setIsItemCollapsed(prev => ({ ...prev, [newItems.length - 1]: false }));
      return updateTotals({ ...prev, items: newItems });
    });
  };

  // Remove item
  const removeItem = (index) => {
    if (orderData.items.length > 1) {
      setOrderData(prev => {
        const newItems = [...prev.items];
        newItems.splice(index, 1);
        const newCollapsed = { ...isItemCollapsed };
        delete newCollapsed[index];
        setIsItemCollapsed(newCollapsed);
        return updateTotals({ ...prev, items: newItems });
      });
    }
  };

  // Toggle item collapse
  const toggleItemCollapse = (index) => {
    setIsItemCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Add size
  const addSize = (itemIndex) => {
    setOrderData(prev => {
      const newItems = [...prev.items];
      const item = newItems[itemIndex];
      if (!item.unitPrice) {
        toast.error('Please select a product with a valid price before adding a size.');
        return prev;
      }
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        sizeQuantities: [...newItems[itemIndex].sizeQuantities, { Size: '', Price: item.unitPrice, Quantity: 1 }]
      };
      return updateTotals({ ...prev, items: newItems });
    });
  };

  // Remove size
  const removeSize = (itemIndex, sizeIndex) => {
    setOrderData(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex].sizeQuantities.splice(sizeIndex, 1);
      return updateTotals({ ...prev, items: newItems });
    });
  };

  // Handle item changes
  const handleItemChange = async (itemIndex, field, value) => {
    if (field === 'productId') {
      try {
        const res = await fetch(`https://printmanager-api.onrender.com/api/products/${value}`);
        if (!res.ok) throw new Error('Product not found');
        const product = await res.json();
        setOrderData(prev => {
          const newItems = [...prev.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            productId: value,
            productTitle: product.title || '',
            serviceTitle: services.find(s => s.id === product.serviceId)?.title || '',
            image: product.files?.[0]?.filePath
              ? `https://printmanager-api.onrender.com${product.files[0].filePath}`
              : '',
            colorOptions: product.colorOptions || [],
            sizeOptions: product.sizeOptions || [],
            color: '',
            size: '',
            unitPrice: product.unitPrice || 0
          };
          return updateTotals({ ...prev, items: newItems });
        });
        setProductSearchResults(prev => ({ ...prev, [itemIndex]: [] }));
        setServiceDropdowns(prev => ({ ...prev, [itemIndex]: {} }));
      } catch (err) {
        toast.error(err.message || 'Error fetching product');
      }
    } else {
      setOrderData(prev => {
        const newItems = [...prev.items];
        newItems[itemIndex][field] = value;
        return updateTotals({ ...prev, items: newItems });
      });
    }
  };

  // Handle size quantity changes
  const handleSizeChange = (itemIndex, sizeIndex, field, value) => {
    setOrderData(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex].sizeQuantities[sizeIndex][field] = 
        field === 'Price' || field === 'Quantity' ? parseFloat(value) || 0 : value;
      if (field === 'Quantity' && value) {
        newItems[itemIndex].sizeQuantities[sizeIndex].Quantity = parseInt(value) || 0;
        newItems[itemIndex].sizeQuantities[sizeIndex].Price = newItems[itemIndex].unitPrice || 0;
      }
      return updateTotals({ ...prev, items: newItems });
    });
  };

  // Update totals
  const updateTotals = (data) => {
    let total = 0;
    let totalQuantity = 0;
    const updatedItems = data.items.map(item => {
      const itemTotal = item.sizeQuantities.reduce((sum, size) => {
        return sum + (size.Price * size.Quantity);
      }, 0);
      const itemQuantity = item.sizeQuantities.reduce((sum, size) => sum + size.Quantity, 0);
      total += itemTotal;
      totalQuantity += itemQuantity;
      return { 
        ...item, 
        total: itemTotal, 
        quantity: itemQuantity,
        price: itemTotal,
        quantity: itemQuantity
      };
    });
    return { ...data, items: updatedItems, total, totalQuantity };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderData.customerId || !orderData.title || !orderData.dueDate || !orderData.items.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    formData.append('customerId', parseInt(orderData.customerId));
    // formData.append('orderNumber', orderData.orderNumber);
    formData.append('title', orderData.title);
    formData.append('status', orderData.status);
    formData.append('createdBy', sessionStorage.getItem('username'));
    if (orderData.startDate) {
      formData.append('startDate', new Date(orderData.startDate).toISOString());
    }
    formData.append('dueDate', new Date(orderData.dueDate).toISOString());
    if (orderData.notes) {
      formData.append('notes', orderData.notes);
    }

    const itemsData = orderData.items.map(item => ({
      productId: parseInt(item.productId),
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.total,
      sizeQuantities: item.sizeQuantities.map(size => ({
        Size: size.Size,
        Price: parseFloat(size.Price),
        Quantity: parseInt(size.Quantity)
      }))
    }));
    formData.append('items', JSON.stringify(itemsData));

    if (orderData.files) {
      for (let file of orderData.files) {
        if (file) {
          formData.append('files', file);
        }
      }
    }

    try {
      const response = await fetch('https://printmanager-api.onrender.com/api/orders', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      toast.success('Order created successfully');
      setOrderData({
        customerId: '',
        customerName: '',
        // orderNumber: `OR#${Math.floor(1000 + Math.random() * 9000)}`,
        title: '',
        status: 'Draft',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: '',
        items: [],
        total: 0,
        totalQuantity: 0,
        files: []
      });
      setCustomerInfo(null);
      setCustomerSearchResults([]);
      setProductSearchResults({});
      setFileInputs([0]);
      fileInputRefs.current.forEach(ref => ref && (ref.value = ''));
      setTimeout(() => router.push('/dashboard/order/list'), 2000);
    } catch (err) {
      toast.error(err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-7">
      <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
              Customer
            </label>
            <input
              type="text"
              name="customerName"
              value={orderData.customerName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
            {customerSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-60 overflow-auto">
                {customerSearchResults.map(customer => (
                  <div
                    key={customer.id}
                    className="px-4 py-2 hover:bg-[#f8fafc] cursor-pointer"
                    onClick={() => selectCustomer(customer)}
                  >
                    {customer.name} ({customer.company}, {customer.email}, {customer.mobile})
                  </div>
                ))}
              </div>
            )}
            {customerInfo && (
              <div className="mt-2 text-sm text-[#111928]">
                Customer: {customerInfo.name} {customerInfo.email && `(${customerInfo.email})`} {`(${customerInfo.mobile})`}
              </div>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
              Order Number
            </label>
            <input
              type="text"
              name="orderNumber"
              value={orderData.orderNumber}
              readOnly
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={orderData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111928]">Status</label>
            <select
              name="status"
              value={orderData.status}
              onChange={handleChange}
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
            <label className="block text-sm font-medium text-[#111928]">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={orderData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={orderData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#111928]">Notes</label>
            <textarea
              name="notes"
              value={orderData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1]"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-[#111928]">Upload Files</label>
              {fileInputs.map((_, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    ref={el => fileInputRefs.current[index] = el}
                    onChange={(e) => handleFileChange(e, index)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg"
                  />
                  {fileInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFileInput(index)}
                      className="text-[#ef4444] text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFileInput}
                className="mt-2 py-1 px-3 bg-[#5750f1] text-white rounded-lg text-sm hover:bg-blue-700"
              >
                More Files
              </button>
              {orderData.files.length > 0 && (
                <div className="mt-2">
                  {orderData.files.map((file, index) => (
                    file && (
                      <div key={index} className="flex justify-between p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg mb-2">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderData(prev => ({
                              ...prev,
                              files: prev.files.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-[#ef4444]"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-[#e2e8f0] border-t-[2px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#111928]">Order Items</h2>
          </div>

          {orderData.items.map((item, itemIndex) => (
            <div key={itemIndex} className="mb-4 bg-white border border-[#e2e8f0] rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleItemCollapse(itemIndex)}
              >
                <h3 className="text-md font-medium text-[#111928]">
                  Item {item.productTitle ? `- ${item.productTitle}` : `#${itemIndex + 1}`}
                </h3>
                <span className="w-[35px] h-[35px] rounded-full flex justify-center items-center text-[20px] font-normal border-[2px] border-[#5750f1] text-[#5750f1]">{isItemCollapsed[itemIndex] ? '+' : '−'}</span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isItemCollapsed[itemIndex] ? 'max-h-0' : 'max-h-[1000px]'
                }`}
              >
                <div className="p-4 mt-2">
                  {orderData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(itemIndex)}
                      className="text-[#ef4444] text-sm mb-4 block cursor-pointer"
                    >
                      Remove
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
                        Product
                      </label>
                      <input
                        type="text"
                        value={item.productTitle}
                        onChange={(e) => {
                          handleItemChange(itemIndex, 'productTitle', e.target.value);
                          handleProductSearch(e.target.value, itemIndex);
                        }}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-[#f2f2f3]"
                        required
                        placeholder="Search by product or service"
                      />
                      {productSearchResults[itemIndex]?.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-60 overflow-auto">
                          {productSearchResults[itemIndex].map((service, serviceIndex) => (
                            <div key={serviceIndex} className="border-b border-[#e5e7eb]">
                              <div
                                className="px-4 py-2 hover:bg-[#f8fafc] cursor-pointer flex justify-between items-center"
                                onClick={() => toggleServiceDropdown(itemIndex, serviceIndex)}
                              >
                                <span>{service.title}</span>
                                <span>{serviceDropdowns[itemIndex]?.[serviceIndex] ? '−' : '+'}</span>
                              </div>
                              {serviceDropdowns[itemIndex]?.[serviceIndex] && (
                                <div>
                                  {service.products.map(product => (
                                    <div
                                      key={product.id}
                                      className="w-full px-4 py-2 hover:bg-[#f8fafc] cursor-pointer flex items-center gap-3"
                                      onClick={() => handleItemChange(itemIndex, 'productId', product.id.toString())}
                                    >
                                      <div className="w-[15px] h-[15px] bg-[#5750f1] rounded-full"></div>
                                      {product.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111928]">Color</label>
                      <select
                        value={item.color}
                        onChange={(e) => handleItemChange(itemIndex, 'color', e.target.value)}
                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-[#f2f2f3]"
                      >
                        <option value="">Select Color</option>
                        {item.colorOptions?.map((color, i) => (
                          <option key={i} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                    <div className="w-full my-10 rounded-[10px] border border-[#e5e7eb] p-5 flex gap-6 items-center">
                        {item.image ? (
                        <div>
                          <img src={item.image} alt={item.productTitle} className=" w-[120px] object-contain rounded-[10px] border-[#e5e7eb] border" />
                        </div>
                      ) : (
                        <div>
                          <div className="h-24 flex items-center justify-center text-sm text-[#6b7280]">
                            No image available
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[18px] text-[#111928]">{item.productTitle}</div>
                        <div className="flex gap-4">
                          <div className="text-[#6b7280] text-[14px]">Color: {item.color || 'Not selected'}</div>
                          <div className="text-[#6b7280] text-[14px]">Service: {item.serviceTitle || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Total:</h5> <h5 className="text-[#6b7280] text-[15px]">${item.total}</h5></div>
                      <div className="border border-[#e5e7eb] px-5 py-4 flex flex-col gap-2"><h5 className="font-bold text-[#111928] text-[16px]">Quantity:</h5> <h5 className="text-[#6b7280] text-[15px]">{item.quantity}</h5></div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-[#111928]">Size Quantities</h4>
                      <button
                        type="button"
                        onClick={() => addSize(itemIndex)}
                        className="py-1 px-3 bg-[#5750f1] text-white rounded-lg text-sm hover:bg-blue-700"
                        disabled={loading}
                      >
                        Add Size
                      </button>
                    </div>

                    {item.sizeQuantities.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="flex gap-4 mb-2 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#111928]">Size</label>
                          <select
                            value={size.Size}
                            onChange={(e) => handleSizeChange(itemIndex, sizeIndex, 'Size', e.target.value)}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-[#f2f2f3]"
                          >
                            <option value="">Select Size</option>
                            {item.sizeOptions?.map((size, i) => (
                              <option key={i} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#111928]">Price</label>
                          <input
                            type="number"
                            value={size.Price}
                            onChange={(e) => handleSizeChange(itemIndex, sizeIndex, 'Price', e.target.value)}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-[#f2f2f3]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#111928]">Quantity</label>
                          <input
                            type="number"
                            value={size.Quantity}
                            onChange={(e) => handleSizeChange(itemIndex, sizeIndex, 'Quantity', e.target.value)}
                            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] bg-[#f2f2f3]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSize(itemIndex, sizeIndex)}
                          className="text-[#ef4444] text-sm cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={addItem}
            className="py-2 px-4 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>

        <div className="mt-6 w-full flex flex-col items-end gap-8">
          <div className='w-[25%]'>
            <div className="text-sm font-medium text-[#111928] flex justify-between w-full mb-4"><h5 className="text-[#111928] font-medium text-[17px]">Total Quantity:</h5> <h5 className="text-[#111928] font-medium text-[17px]">{orderData.totalQuantity}</h5></div>
            <div className="text-sm font-medium text-[#111928] flex justify-between w-full border-t border-[#e5e7eb] pt-[15px]"><h5 className="text-[#111928] font-medium text-[17px]">Order Total:</h5> <h5 className="text-[#111928] font-medium text-[17px]">${orderData.total}</h5></div>
          </div>
          <div className="flex justify-end">
            <button
            type="submit"
            onClick={handleSubmit}
            className={`py-3 px-8 bg-[#5750f1] text-white rounded-lg flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
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
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}