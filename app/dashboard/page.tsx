'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  mobile: string;
}

interface Order {
  id: number;
  customerId: number;
  customer: Customer;
  clothType: string;
  stitchingType: string;
  measurementsGiven: string;
  numberOfItems: number;
  charge: number;
  deliveryDate: string;
  waist: string | null;
  length: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchDeliveryDate, setSearchDeliveryDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<number | null>(null);
  const [filterCustomerName, setFilterCustomerName] = useState<string>('');
  const itemsPerPage = 12;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const customerId = searchParams.get('customerId');
    if (customerId) {
      setCustomerFilter(parseInt(customerId));
    } else {
      setCustomerFilter(null);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;

    // Apply customer filter first if present
    if (customerFilter) {
      filtered = filtered.filter((order) => order.customerId === customerFilter);
      // Find customer name for display
      if (filtered.length > 0) {
        setFilterCustomerName(filtered[0].customer.name);
      }
    }

    if (searchName) {
      filtered = filtered.filter((order) =>
        order.customer.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchMobile) {
      filtered = filtered.filter((order) =>
        order.customer.mobile.includes(searchMobile)
      );
    }

    if (searchDeliveryDate) {
      filtered = filtered.filter((order) =>
        order.deliveryDate.includes(searchDeliveryDate)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchName, searchMobile, searchDeliveryDate, orders, customerFilter]);

  const getDeliveryStatus = (deliveryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(deliveryDate);
    delivery.setHours(0, 0, 0, 0);

    const daysUntilDelivery = Math.floor(
      (delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDelivery < 0) {
      return { status: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilDelivery === 0) {
      return { status: 'today', label: 'Today', color: 'bg-orange-100 text-orange-800' };
    } else if (daysUntilDelivery <= 3) {
      return {
        status: 'approaching',
        label: `${daysUntilDelivery} day${daysUntilDelivery > 1 ? 's' : ''} left`,
        color: 'bg-yellow-100 text-yellow-800',
      };
    } else if (daysUntilDelivery <= 7) {
      return {
        status: 'soon',
        label: `${daysUntilDelivery} days left`,
        color: 'bg-blue-100 text-blue-800',
      };
    }

    return { status: 'normal', label: `${daysUntilDelivery} days left`, color: 'bg-green-100 text-green-800' };
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">
              {customerFilter ? `Orders - ${filterCustomerName}` : 'Orders'}
            </h1>
            {customerFilter && (
              <button
                onClick={() => {
                  setCustomerFilter(null);
                  setFilterCustomerName('');
                  setSearchName('');
                  setSearchMobile('');
                  setSearchDeliveryDate('');
                }}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
              >
                ✕ Clear Filter
              </button>
            )}
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
            />
            <input
              type="text"
              placeholder="Search by mobile number..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
            />
            <input
              type="date"
              value={searchDeliveryDate}
              onChange={(e) => setSearchDeliveryDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-gray-700 dark:text-gray-300"
            />
          </div>

          {/* Result Count and Add Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </div>
            <Link
              href="/new-stitching"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors text-sm"
            >
              Add New Order
            </Link>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            {filteredOrders.length === 0 
              ? (customerFilter ? 'No orders found for this customer' : 'No orders found') 
              : 'No more orders to display'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedOrders.map((order) => {
              const deliveryStatus = getDeliveryStatus(order.deliveryDate);
              return (
                <div
                  key={order.id}
                  className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow bg-background"
                >
                  {/* Header with Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{order.customer.name}</h3>
                      <p className="text-sm text-gray-600">{order.customer.mobile}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${deliveryStatus.color}`}>
                      {deliveryStatus.label}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cloth Type:</span>
                      <span className="text-sm font-medium">{order.clothType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stitching Type:</span>
                      <span className="text-sm font-medium">{order.stitchingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="text-sm font-medium">{order.numberOfItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Charge:</span>
                      <span className="text-sm font-medium">₹{order.charge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery Date:</span>
                      <span className="text-sm font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    {order.waist && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Waist:</span>
                        <span className="text-sm font-medium">{order.waist}</span>
                      </div>
                    )}
                    {order.length && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Length:</span>
                        <span className="text-sm font-medium">{order.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Order ID */}
                  <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span>Order ID: #{order.id}</span>
                    <Link
                      href={`/edit-stitching/${order.id}`}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
