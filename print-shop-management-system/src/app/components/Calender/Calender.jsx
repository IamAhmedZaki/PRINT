"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateOrders, setSelectedDateOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const today = new Date();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://printmanager-api.onrender.com/api/orders');
        setOrders(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get orders for a specific date
  const getOrdersForDate = (date) => {
    if (!date || !Array.isArray(orders)) return [];
    return orders.filter(order => {
      if (!order.dueDate) return false;
      const dueDate = new Date(order.dueDate);
      return dueDate.toDateString() === date.toDateString();
    });
  };

  // Open modal with orders for the selected date
  const openModal = (date) => {
    const ordersForDate = getOrdersForDate(date);
    setSelectedDateOrders(ordersForDate);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDateOrders([]);
  };

  // Generate weeks for rendering
  const daysInMonth = getDaysInMonth();
  const weeks = [];
  let week = [];

  daysInMonth.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0 || index === daysInMonth.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const handelViewOrder = (orderId) => {
    router.push(`/dashboard/order/view/${orderId}`);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4 bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
        <button
          onClick={prevMonth}
          className="py-3.5 px-10 lg:px-8 xl:px-10 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          Previous
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className="py-3.5 px-10 lg:px-8 xl:px-10 bg-[#5750f1] rounded-full text-white cursor-pointer"
        >
          Next
        </button>
      </div>

      {!loading && <p></p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-full rounded-[10px] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-[10px] bg-[#5750f1] text-white">
              <th className="flex h-15 items-center justify-center rounded-tl-[10px] p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Sunday </span>
                <span className="block lg:hidden"> Sun </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Monday </span>
                <span className="block lg:hidden"> Mon </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Tuesday </span>
                <span className="block lg:hidden"> Tue </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Wednesday </span>
                <span className="block lg:hidden"> Wed </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Thursday </span>
                <span className="block lg:hidden"> Thur </span>
              </th>
              <th className="flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Friday </span>
                <span className="block lg:hidden"> Fri </span>
              </th>
              <th className="flex h-15 items-center justify-center rounded-tr-[10px] p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Saturday </span>
                <span className="block lg:hidden"> Sat </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} className="grid grid-cols-7">
                {week.map((day, dayIndex) => (
                  <td
                    key={day ? day.getTime() : `empty-${weekIndex}-${dayIndex}`}
                    className={`ease-in relative h-20 cursor-pointer border border-gray-200 p-2 transition duration-500 hover:bg-gray-100 md:h-25 md:p-6 xl:h-31
                      ${weekIndex === weeks.length - 1 && dayIndex === 0 ? 'rounded-bl-[10px]' : ''}
                      ${weekIndex === weeks.length - 1 && dayIndex === 6 ? 'rounded-br-[10px]' : ''}
                      ${day && day.toDateString() === today.toDateString() ? 'bg-[#e0e7ff]' : ''}`}
                  >
                    {day && (
                      <>
                        <span className="font-medium">{day.getDate()}</span>
                        <div className="h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
                          {getOrdersForDate(day).length > 0 && (
                            <div className="flex flex-col">
                              {/* Show only the first order */}
                              <div
                                className="flex flex-col rounded-r-[5px] border-l-[3px] border-[#5750f1] bg-gray-100 px-3 py-1 text-left"
                                onClick={() => handelViewOrder(getOrdersForDate(day)[0].id)}
                              >
                                <span className="font-medium">
                                  Order {getOrdersForDate(day)[0].orderNumber}
                                </span>
                                <span className="text-sm">
                                  Due: {new Date(getOrdersForDate(day)[0].dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              {/* Show "View More Orders" link if there are multiple orders */}
                              {getOrdersForDate(day).length > 1 && (
                                <button
                                  className="text-sm text-[#5750f1] hover:underline mt-1 cursor-pointer"
                                  onClick={() => openModal(day)}
                                >
                                  View More Orders
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying all orders */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#111928]/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              Orders for {selectedDateOrders[0] && new Date(selectedDateOrders[0].dueDate).toLocaleDateString()}
            </h3>
            <div className="space-y-4">
              {selectedDateOrders.map(order => (
                <div
                  key={order.id}
                  className="flex flex-col rounded-r-[5px] border-l-[3px] border-[#5750f1] bg-gray-100 px-3 py-2 cursor-pointer"
                  onClick={() => handelViewOrder(order.id)}
                >
                  <span className="font-medium">Order {order.orderNumber}</span>
                  <span className="text-sm">Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 py-3.5 px-10 lg:px-8 xl:px-10 bg-[#5750f1] rounded-full text-white cursor-pointer"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;