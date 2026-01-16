'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';

// Type definitions
type Customer = {
  id: number;
  name: string;
  mobile: string;
};

type ClothType = 'Pants' | 'Shirts' | 'Dresses' | 'Jackets';

type Step3FormData = {
  stitchingType: 'Stitching' | 'Alteration';
  measurementsGiven: 'Yes' | 'No';
  numberOfItems: number;
  charge: number;
  deliveryDate: string;
};

type Measurement = {
  name: string;
  value: string;
};

type MeasurementFormData = {
  waist?: string;
  length?: string;
  images?: File[];
};

// Step3Form component for order details form
const Step3Form = ({ onSubmit, onBack, stitchingType, initialData }: {
  onSubmit: (data: Step3FormData) => void;
  onBack: () => void;
  stitchingType: string;
  initialData: Step3FormData;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3FormData>({ defaultValues: initialData });
  const [clothImages, setClothImages] = useState<File[]>([]);
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">Order Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Stitching Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Stitching"
                {...register('stitchingType')}
                className="mr-2"
              />
              <span className="text-black dark:text-white">Stitching</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Alteration"
                {...register('stitchingType')}
                className="mr-2"
              />
              <span className="text-black dark:text-white">Alteration</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Measurements Given *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Yes"
                {...register('measurementsGiven')}
                className="mr-2"
              />
              <span className="text-black dark:text-white">Given</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="No"
                {...register('measurementsGiven')}
                className="mr-2"
              />
              <span className="text-black dark:text-white">Not Given</span>
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
            {initialData.stitchingType === 'Stitching' ? 'Stitching Charge' : 'Alteration Charge'} *
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
            placeholder="Enter charge amount"
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
            })}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.deliveryDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.deliveryDate.message}
            </p>
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
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

// MeasurementModal component for adding/editing measurements
const MeasurementModal = ({
  clothType,
  onClose,
  onSubmit,
  initialWaist,
  initialLength,
}: {
  clothType: ClothType;
  onClose: () => void;
  onSubmit: (data: MeasurementFormData) => void;
  initialWaist?: string;
  initialLength?: string;
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MeasurementFormData>({
    defaultValues: {
      waist: initialWaist || '',
      length: initialLength || '',
    },
  });

  const onFormSubmit = (data: MeasurementFormData) => {
    console.log('Measurement form submitted:', data);
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Add Measurements</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Waist
            </label>
            <input
              type="text"
              {...register('waist')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 32 inches"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Length
            </label>
            <input
              type="text"
              {...register('length')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 40 inches"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Order {
  id: number;
  customerId: number;
  customer: Customer;
  clothType: ClothType;
  stitchingType: string;
  measurementsGiven: string;
  numberOfItems: number;
  charge: number;
  deliveryDate: string;
  waist: string | null;
  length: string | null;
}

export default function EditStitchingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedClothType, setSelectedClothType] = useState<ClothType | null>(null);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [clothImages, setClothImages] = useState<File[]>([]);
  const [measurementImages, setMeasurementImages] = useState<File[]>([]);

  // Correct async useEffect for loading order and customers
  useEffect(() => {
    (async () => {
      try {
        await fetchOrder();
        await fetchCustomers();
      } catch (err) {
        setError('Failed to load order or customers.');
        console.error('Edit page load error:', err);
      }
    })();
  }, [orderId]);

  // Add fetchCustomers implementation
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data: Customer[] = await response.json();
        setCustomers(data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      setError('Failed to fetch customers.');
      console.error('Error fetching customers:', err);
    }
  };

  // Add handleAddMeasurement stub if missing
  const handleAddMeasurement = (data: MeasurementFormData) => {
    console.log('Adding measurements:', data);
    // Example: update measurements state
    const newMeasurements: Measurement[] = [];
    if (data.waist) newMeasurements.push({ name: 'Waist', value: data.waist });
    if (data.length) newMeasurements.push({ name: 'Length', value: data.length });
    setMeasurements(newMeasurements);
    setMeasurementImages(data.images || []);
    // Close the modal after saving
    setIsMeasurementModalOpen(false);
    console.log('Measurements updated:', newMeasurements);
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data: Order = await response.json();
        setOrder(data);
        setSelectedCustomer(data.customer);
        setSelectedClothType(data.clothType as ClothType);
        
        // Set measurements if they exist
        if (data.waist || data.length) {
          const meas: Measurement[] = [];
          if (data.waist) meas.push({ name: 'Waist', value: data.waist });
          if (data.length) meas.push({ name: 'Length', value: data.length });
          setMeasurements(meas);
        }
        setStep(3);
      } else {
        const errorText = await response.text();
        setError(`Order not found. Server response: ${errorText}`);
        console.error('Order fetch failed:', errorText);
      }
    } catch (err) {
      setError('Failed to fetch order.');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (formData: Step3FormData) => {
    if (!order || !selectedCustomer || !selectedClothType) {
      alert('Order data is incomplete');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updateData = {
        clothType: selectedClothType,
        stitchingType: formData.stitchingType,
        measurementsGiven: formData.measurementsGiven,
        numberOfItems: formData.numberOfItems,
        charge: formData.charge,
        deliveryDate: formData.deliveryDate,
        waist: measurements.find(m => m.name === 'Waist')?.value || null,
        length: measurements.find(m => m.name === 'Length')?.value || null,
      };

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        alert(`Order updated successfully! Order ID: ${updatedOrder.id}`);
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-gray-500">Loading order details...</p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-red-500">{error || 'Order not found'}</p>
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Edit Order #{order.id}</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === 3 && order && (
          <>
            {isMeasurementModalOpen && (
              <MeasurementModal
                clothType={selectedClothType || 'Pants'}
                onClose={() => setIsMeasurementModalOpen(false)}
                onSubmit={handleAddMeasurement}
                initialWaist={measurements.find(m => m.name === 'Waist')?.value}
                initialLength={measurements.find(m => m.name === 'Length')?.value}
              />
            )}

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-medium text-black dark:text-white">{selectedCustomer?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mobile</p>
                  <p className="font-medium text-black dark:text-white">{selectedCustomer?.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cloth Type</p>
                  <p className="font-medium text-black dark:text-white">{selectedClothType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Measurements</p>
                  <button
                    type="button"
                    onClick={() => setIsMeasurementModalOpen(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    {measurements.length > 0 ? 'Edit' : 'Add'}
                  </button>
                </div>
              </div>
            </div>

            <Step3Form
              onSubmit={handleSubmit}
              onBack={() => router.push('/')}
              stitchingType={selectedClothType || 'Pants'}
              initialData={{
                stitchingType: (order.stitchingType as 'Stitching' | 'Alteration') || 'Stitching',
                measurementsGiven: (order.measurementsGiven as 'Yes' | 'No') || 'No',
                numberOfItems: order.numberOfItems,
                charge: order.charge,
                deliveryDate: order.deliveryDate,
              }}
            />


          </>
        )}
      </div>
    </div>
  );

}
