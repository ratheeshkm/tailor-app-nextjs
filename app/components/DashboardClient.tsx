'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  status?: string;
  waist: string | null;
  length: string | null;
  createdAt: string;
}

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<number | null>(null);
  const [filterCustomerName, setFilterCustomerName] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'delivered'>('all');
  const itemsPerPage = 12;

  const getOrderStatus = (order: Order): 'pending' | 'completed' | 'delivered' => {
    const s = order.status?.toLowerCase();
    if (s === 'completed' || s === 'delivered') return s;
    return 'pending';
  };

  useEffect(() => {
    const customerId = searchParams.get('customerId');
    if (customerId) {
      setCustomerFilter(parseInt(customerId));
    } else {
      setCustomerFilter(null);
      setFilterCustomerName('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        credentials: 'include',
      });
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

    if (customerFilter) {
      filtered = filtered.filter((order) => order.customerId === customerFilter);
      if (filtered.length > 0) {
        setFilterCustomerName(filtered[0].customer.name);
      }
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => getOrderStatus(order) === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const nameMatch = order.customer.name.toLowerCase().includes(query);
        const mobileMatch = order.customer.mobile.includes(searchQuery);
        const dateMatch = order.deliveryDate.includes(searchQuery);
        const createdDateMatch = order.createdAt.includes(searchQuery);

        return nameMatch || mobileMatch || dateMatch || createdDateMatch;
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, orders, customerFilter, statusFilter]);

  const pendingCount = orders.filter((o) => getOrderStatus(o) === 'pending').length;
  const completedCount = orders.filter((o) => getOrderStatus(o) === 'completed').length;
  const deliveredCount = orders.filter((o) => getOrderStatus(o) === 'delivered').length;

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">
                {customerFilter ? `Orders - ${filterCustomerName}` : 'Orders'}
              </h1>
              {customerFilter && (
                <button
                  onClick={() => {
                    setCustomerFilter(null);
                    setFilterCustomerName('');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
                >
                  ✕ Clear Filter
                </button>
              )}
            </div>
            <Link
              href="/new-stitching"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors"
            >
              + Add New Order
            </Link>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by customer name, mobile number, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'delivered'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Delivered ({deliveredCount})
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            {filteredOrders.length === 0
              ? (customerFilter
                  ? 'No orders found for this customer'
                  : statusFilter !== 'all'
                    ? `No ${statusFilter} orders found`
                    : 'No orders found')
              : 'No more orders to display'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedOrders.map((order) => {
              const deliveryStatus = getDeliveryStatus(order.deliveryDate);
              return (
                <div
                  key={order.id}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">{order.customer.name}</h3>
                      <a
                        href={`tel:${order.customer.mobile}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {order.customer.mobile}
                      </a>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${deliveryStatus.color}`}>
                      {deliveryStatus.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cloth Type:</span>
                      <span className="text-sm font-medium text-black dark:text-white">
                        {typeof order.clothType === 'string' && order.clothType !== '[object Object]'
                          ? order.clothType
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Stitching Type:</span>
                      <span className="text-sm font-medium text-black dark:text-white">{order.stitchingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Items:</span>
                      <span className="text-sm font-medium text-black dark:text-white">{order.numberOfItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Charge:</span>
                      <span className="text-sm font-medium text-black dark:text-white">₹{order.charge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Delivery Date:</span>
                      <span className="text-sm font-medium text-black dark:text-white">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
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

