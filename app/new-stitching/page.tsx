'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNewStitching } from '../contexts/NewStitchingContext';

type Customer = {
  id: number;
  name: string;
  mobile: string;
};

type ClothType = 'Pants' | 'Shirts' | 'Dresses' | 'Jackets';

type Measurement = {
  name: string;
  value: string;
};

const clothTypes: ClothType[] = ['Pants', 'Shirts', 'Dresses', 'Jackets'];

type MeasurementFormData = {
  waist: string;
  length: string;
  images: File[];
};

type Step3FormData = {
  stitchingType: 'Stitching' | 'Alteration';
  measurementsGiven: 'Yes' | 'No';
  numberOfItems: number;
  charge: number;
  deliveryDate: string;
};

type MeasurementModalProps = {
  clothType: ClothType;
  onClose: () => void;
  onSubmit: (data: MeasurementFormData) => void;
};

function MeasurementModal({ clothType, onClose, onSubmit }: MeasurementModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MeasurementFormData>();

  const [measurementImages, setMeasurementImages] = useState<File[]>([]);

  const onFormSubmit = (data: MeasurementFormData) => {
    const formData = {
      ...data,
      images: measurementImages,
    };
    onSubmit(formData);
    reset();
    setMeasurementImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Enter Measurements for {clothType}
        </h3>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Waist *
            </label>
            <input
              type="text"
              {...register('waist', {
                required: 'Waist measurement is required',
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: 'Please enter a valid number',
                },
                min: {
                  value: 20,
                  message: 'Waist must be at least 20 inches',
                },
                max: {
                  value: 60,
                  message: 'Waist must be less than 60 inches',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter waist measurement (inches)"
            />
            {errors.waist && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.waist.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Length *
            </label>
            <input
              type="text"
              {...register('length', {
                required: 'Length measurement is required',
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: 'Please enter a valid number',
                },
                min: {
                  value: 10,
                  message: 'Length must be at least 10 inches',
                },
                max: {
                  value: 80,
                  message: 'Length must be less than 80 inches',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter length measurement (inches)"
            />
            {errors.length && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.length.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Measurement Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setMeasurementImages(prev => [...prev, ...files]);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {measurementImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {measurementImages.length} image(s) selected
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {measurementImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Measurement ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMeasurementImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Measurements
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type Step3FormProps = {
  onSubmit: (data: Step3FormData) => Promise<void>;
  onBack: () => void;
  clothImages: File[];
  setClothImages: (images: File[]) => void;
  measurements: Measurement[];
  isMeasurementModalOpen: boolean;
  setIsMeasurementModalOpen: (open: boolean) => void;
  selectedClothType: ClothType;
  handleAddMeasurement: (data: MeasurementFormData) => void;
  selectedCustomer: Customer | null;
};

function Step3Form({
  onSubmit,
  onBack,
  clothImages,
  setClothImages,
  measurements,
  isMeasurementModalOpen,
  setIsMeasurementModalOpen,
  selectedClothType,
  handleAddMeasurement,
  selectedCustomer,
}: Step3FormProps) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Step3FormData>({
    defaultValues: {
      stitchingType: 'Stitching',
      measurementsGiven: 'No',
      numberOfItems: 1,
      charge: 500,
      deliveryDate: '',
    },
  });

  const stitchingType = watch('stitchingType');

  useEffect(() => {
    if (stitchingType === 'Stitching') {
      setValue('charge', 500);
    } else {
      setValue('charge', 200);
    }
  }, [stitchingType, setValue]);

  const onFormSubmit = async (data: Step3FormData) => {
    await onSubmit(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
        Order Details for {selectedCustomer?.name} - {selectedClothType}
      </h2>
      <form onSubmit={handleFormSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Type *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Stitching"
                {...register('stitchingType')}
                className="mr-2"
              />
              Stitching
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Alteration"
                {...register('stitchingType')}
                className="mr-2"
              />
              Alteration
            </label>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsMeasurementModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Measurements
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Measurements *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Yes"
                {...register('measurementsGiven')}
                className="mr-2"
              />
              Given
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="No"
                {...register('measurementsGiven')}
                className="mr-2"
              />
              Not Given
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Number of Items *
          </label>
          <input
            type="number"
            {...register('numberOfItems', {
              required: 'Number of Items is required',
              min: { value: 1, message: 'Must be at least 1' },
              max: { value: 100, message: 'Must be 100 or less' },
            })}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of items"
          />
          {errors.numberOfItems && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.numberOfItems.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            {stitchingType === 'Stitching' ? 'Stitching Charge' : 'Alteration Charge'} *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('charge', {
              required: 'Charge is required',
              min: { value: 0, message: 'Charge cannot be negative' },
              validate: (value) => {
                if (isNaN(value)) return 'Please enter a valid number';
                return true;
              },
            })}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter charge amount (can be 0)"
          />
          {errors.charge && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.charge.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Delivery Date *
          </label>
          <input
            type="date"
            {...register('deliveryDate', {
              required: 'Delivery Date is required',
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || 'Delivery date cannot be in the past';
              },
            })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.deliveryDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Cloth Images
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setClothImages([...clothImages, ...files]);
                e.target.value = '';
              }}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can select multiple images at once or click the upload area multiple times to add more images.
            </p>
          </div>
          {clothImages.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {clothImages.length} image(s) added
                </p>
                <button
                  type="button"
                  onClick={() => setClothImages([])}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {clothImages.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Cloth ${index + 1}`}
                      className="w-full h-20 object-cover rounded border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setClothImages(clothImages.filter((_, i) => i !== index));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewStitchingPage() {
  const { resetKey } = useNewStitching();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedClothType, setSelectedClothType] = useState<ClothType | null>(null);
  const [clothImages, setClothImages] = useState<File[]>([]);
  const [measurementImages, setMeasurementImages] = useState<File[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 12;
  const [clothTypeSearchTerm, setClothTypeSearchTerm] = useState('');
  const [clothTypeCurrentPage, setClothTypeCurrentPage] = useState(1);
  const clothTypesPerPage = 12;

  useEffect(() => {
    // Reset to step 1 and clear all data when resetKey changes
    setStep(1);
    setSelectedCustomer(null);
    setSelectedClothType(null);
    setMeasurements([]);
    setClothImages([]);
    setMeasurementImages([]);
    setIsMeasurementModalOpen(false);
    setSearchTerm('');
    setCurrentPage(1);
    setClothTypeSearchTerm('');
    setClothTypeCurrentPage(1);
  }, [resetKey]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error('Failed to fetch customers:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep(2);
  };

  const handleClothTypeSelect = (type: ClothType) => {
    setSelectedClothType(type);
    setStep(3);
  };

  const handleAddMeasurement = (data: MeasurementFormData) => {
    if (!selectedClothType) return;
    const newMeasurements = [
      { name: 'Waist', value: data.waist },
      { name: 'Length', value: data.length },
    ];
    setMeasurements(newMeasurements);
    setMeasurementImages(data.images);
  };

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Reset cloth type page when cloth type search changes
    setClothTypeCurrentPage(1);
  }, [clothTypeSearchTerm]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  );

  // Pagination logic for customers
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Cloth type filtering and pagination
  const filteredClothTypes = clothTypes.filter(type =>
    type.toLowerCase().includes(clothTypeSearchTerm.toLowerCase())
  );

  const clothTypeTotalPages = Math.ceil(filteredClothTypes.length / clothTypesPerPage);
  const clothTypeStartIndex = (clothTypeCurrentPage - 1) * clothTypesPerPage;
  const clothTypeEndIndex = clothTypeStartIndex + clothTypesPerPage;
  const paginatedClothTypes = filteredClothTypes.slice(clothTypeStartIndex, clothTypeEndIndex);

  const handleSubmit = async (formData: Step3FormData) => {
    try {
      if (!selectedCustomer || !selectedClothType) {
        alert('Please complete all steps of the form');
        return;
      }

      const orderData = {
        customerId: selectedCustomer.id,
        clothType: selectedClothType,
        stitchingType: formData.stitchingType,
        measurementsGiven: formData.measurementsGiven,
        numberOfItems: formData.numberOfItems,
        charge: formData.charge,
        deliveryDate: formData.deliveryDate,
        waist: measurements.find(m => m.name === 'Waist')?.value || null,
        length: measurements.find(m => m.name === 'Length')?.value || null,
      };

      console.log('Submitting order:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        alert(`Order submitted successfully! Order ID: ${order.id}`);
        // Reset form to step 1
        setStep(1);
        setSelectedCustomer(null);
        setSelectedClothType(null);
        setMeasurements([]);
        setClothImages([]);
        setMeasurementImages([]);
        setIsMeasurementModalOpen(false);
        setSearchTerm('');
        setCurrentPage(1);
        setClothTypeSearchTerm('');
        setClothTypeCurrentPage(1);
      } else {
        const error = await response.json();
        console.error('API error:', error);
        alert(`Error submitting order: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">New Stitching Order</h1>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Select Customer</h2>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading customers...</p>
            ) : customers.length === 0 ? (
              <p className="text-center text-gray-500">No customers found. <a href="/add-customer" className="text-blue-500 hover:underline">Add a customer first</a>.</p>
            ) : filteredCustomers.length === 0 ? (
              <p className="text-center text-gray-500">No customers match your search. <button onClick={() => setSearchTerm('')} className="text-blue-500 hover:underline">Clear search</button></p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`p-4 rounded-lg shadow transition-all text-left ${
                        selectedCustomer?.id === customer.id
                          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                          : 'bg-white dark:bg-gray-800 hover:shadow-md text-black dark:text-white'
                      }`}
                    >
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className={`text-sm ${
                        selectedCustomer?.id === customer.id
                          ? 'text-blue-100'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {customer.mobile}
                      </p>
                      {selectedCustomer?.id === customer.id && (
                        <div className="mt-2 flex items-center text-xs font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm border rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 2 && selectedCustomer && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Select Cloth Type for {selectedCustomer.name}</h2>

            {/* Cloth Type Search Input */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search cloth types..."
                  value={clothTypeSearchTerm}
                  onChange={(e) => setClothTypeSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {clothTypeSearchTerm && (
                  <button
                    onClick={() => setClothTypeSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {filteredClothTypes.length === 0 ? (
              <p className="text-center text-gray-500">No cloth types match your search. <button onClick={() => setClothTypeSearchTerm('')} className="text-blue-500 hover:underline">Clear search</button></p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedClothTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleClothTypeSelect(type)}
                      className={`p-4 rounded-lg shadow transition-all text-left ${
                        selectedClothType === type
                          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                          : 'bg-white dark:bg-gray-800 hover:shadow-md text-black dark:text-white'
                      }`}
                    >
                      <h3 className="font-medium">{type}</h3>
                      {selectedClothType === type && (
                        <div className="mt-2 flex items-center text-xs font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Cloth Type Pagination Controls */}
                {clothTypeTotalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {clothTypeStartIndex + 1} to {Math.min(clothTypeEndIndex, filteredClothTypes.length)} of {filteredClothTypes.length} cloth types
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setClothTypeCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={clothTypeCurrentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(clothTypeTotalPages, 5) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setClothTypeCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm border rounded-md ${
                                clothTypeCurrentPage === pageNum
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setClothTypeCurrentPage(prev => Math.min(prev + 1, clothTypeTotalPages))}
                        disabled={clothTypeCurrentPage === clothTypeTotalPages}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={() => setStep(1)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        )}

        {step === 3 && selectedCustomer && selectedClothType && <Step3Form onSubmit={handleSubmit} onBack={() => setStep(2)} clothImages={clothImages} setClothImages={setClothImages} measurements={measurements} isMeasurementModalOpen={isMeasurementModalOpen} setIsMeasurementModalOpen={setIsMeasurementModalOpen} selectedClothType={selectedClothType} handleAddMeasurement={handleAddMeasurement} selectedCustomer={selectedCustomer} />}

        {/* Measurement Modal */}
        {isMeasurementModalOpen && selectedClothType && (
          <MeasurementModal
            clothType={selectedClothType}
            onClose={() => setIsMeasurementModalOpen(false)}
            onSubmit={handleAddMeasurement}
          />
        )}
      </div>
    </div>
  );
}