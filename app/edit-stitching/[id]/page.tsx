'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { uploadImages } from '../../lib/cloudinary';
import ImageViewer from '../../components/ImageViewer';

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
  shoulderWidth?: string;
  chest?: string;
  hip?: string;
  bicep?: string;
  neck?: string;
  collar?: string;
  sleeve?: string;
  notes?: string;
  images?: File[];
};

// Step3Form component for order details form
const Step3Form = ({ 
  onSubmit, 
  onBack, 
  stitchingType, 
  initialData, 
  isSubmitting,
  clothImages,
  setClothImages,
  existingClothImageUrls,
  setExistingClothImageUrls,
}: {
  onSubmit: (data: Step3FormData) => void;
  onBack: () => void;
  stitchingType: string;
  initialData: Step3FormData;
  isSubmitting: boolean;
  clothImages: File[];
  setClothImages: (images: File[]) => void;
  existingClothImageUrls: string[];
  setExistingClothImageUrls: (urls: string[]) => void;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3FormData>({ defaultValues: initialData });
  const [viewingImage, setViewingImage] = useState<string | null>(null);
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

        {/* Cloth Images Section */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Cloth Images
          </label>
          
          {/* Existing Cloth Images from DB */}
          {existingClothImageUrls.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current cloth images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {existingClothImageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Existing cloth ${index + 1}`}
                      className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setViewingImage(url)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExistingClothImageUrls(existingClothImageUrls.filter((_, i) => i !== index));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setExistingClothImageUrls([])}
                className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove All Current Cloth Images
              </button>
            </div>
          )}

          {/* New Cloth Images Upload */}
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
              You can select multiple images at once
            </p>
          </div>
          
          {clothImages.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {clothImages.length} new image(s) to upload
                </p>
                <button
                  type="button"
                  onClick={() => setClothImages([])}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear All New
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {clothImages.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New cloth ${index + 1}`}
                      className="w-full h-20 object-cover rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setViewingImage(URL.createObjectURL(file))}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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

        {viewingImage && (
          <ImageViewer
            imageUrl={viewingImage}
            onClose={() => setViewingImage(null)}
          />
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Order'}
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
  initialValues,
  existingImageUrls,
}: {
  clothType: ClothType;
  onClose: () => void;
  onSubmit: (data: MeasurementFormData & { existingUrls?: string[] }) => void;
  initialValues?: MeasurementFormData;
  existingImageUrls?: string[];
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MeasurementFormData>({
    defaultValues: initialValues || {
      waist: '',
      length: '',
      shoulderWidth: '',
      chest: '',
      hip: '',
      bicep: '',
      neck: '',
      collar: '',
      sleeve: '',
      notes: '',
    },
  });

  const [measurementImages, setMeasurementImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(existingImageUrls || []);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const onFormSubmit = (data: MeasurementFormData) => {
    console.log('Measurement form submitted:', data);
    const formData = {
      ...data,
      images: measurementImages,
      existingUrls: existingImages,
    };
    onSubmit(formData);
    reset();
    setMeasurementImages([]);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Measurements</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Shoulder Width
              </label>
              <input
                type="text"
                {...register('shoulderWidth')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter shoulder width"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Chest
              </label>
              <input
                type="text"
                {...register('chest')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter chest measurement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Hip
              </label>
              <input
                type="text"
                {...register('hip')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hip measurement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Bicep
              </label>
              <input
                type="text"
                {...register('bicep')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bicep measurement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Neck
              </label>
              <input
                type="text"
                {...register('neck')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter neck measurement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Collar
              </label>
              <input
                type="text"
                {...register('collar')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter collar measurement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Sleeve
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="full"
                    {...register('sleeve')}
                    className="mr-2"
                  />
                  <span className="text-black dark:text-white">Full</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="half"
                    {...register('sleeve')}
                    className="mr-2"
                  />
                  <span className="text-black dark:text-white">Half</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes or special instructions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Measurement Images
            </label>
            
            {/* Existing Images from DB */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current images:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setViewingImage(url)}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExistingImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setExistingImages([])}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove All Current Images
                </button>
              </div>
            )}
            
            {/* New Images Upload */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setMeasurementImages(prev => [...prev, ...files]);
                e.target.value = '';
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {measurementImages.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {measurementImages.length} image(s) selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setMeasurementImages([])}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {measurementImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Measurement ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setViewingImage(URL.createObjectURL(file))}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
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

          {viewingImage && (
            <ImageViewer
              imageUrl={viewingImage}
              onClose={() => setViewingImage(null)}
            />
          )}

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
              Update Measurements
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
  shoulderWidth?: string | null;
  chest?: string | null;
  hip?: string | null;
  bicep?: string | null;
  neck?: string | null;
  collar?: string | null;
  sleeve?: string | null;
  notes?: string | null;
  measurementImages?: string | null;
  clothImages?: string | null;
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
  const [existingMeasurementImageUrls, setExistingMeasurementImageUrls] = useState<string[]>([]);
  const [existingClothImageUrls, setExistingClothImageUrls] = useState<string[]>([]);

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
  const handleAddMeasurement = (data: MeasurementFormData & { existingUrls?: string[] }) => {
    console.log('Adding measurements:', data);
    // Update measurements state
    const newMeasurements: Measurement[] = [];
    if (data.waist) newMeasurements.push({ name: 'Waist', value: data.waist });
    if (data.length) newMeasurements.push({ name: 'Length', value: data.length });
    if (data.shoulderWidth) newMeasurements.push({ name: 'Shoulder Width', value: data.shoulderWidth });
    if (data.chest) newMeasurements.push({ name: 'Chest', value: data.chest });
    if (data.hip) newMeasurements.push({ name: 'Hip', value: data.hip });
    if (data.bicep) newMeasurements.push({ name: 'Bicep', value: data.bicep });
    if (data.neck) newMeasurements.push({ name: 'Neck', value: data.neck });
    if (data.collar) newMeasurements.push({ name: 'Collar', value: data.collar });
    if (data.sleeve) newMeasurements.push({ name: 'Sleeve', value: data.sleeve });
    if (data.notes) newMeasurements.push({ name: 'Notes', value: data.notes });
    setMeasurements(newMeasurements);
    setMeasurementImages(data.images || []);
    setExistingMeasurementImageUrls(data.existingUrls || []);
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
        const meas: Measurement[] = [];
        if (data.waist) meas.push({ name: 'Waist', value: data.waist });
        if (data.length) meas.push({ name: 'Length', value: data.length });
        if ((data as any).shoulderWidth) meas.push({ name: 'Shoulder Width', value: (data as any).shoulderWidth });
        if ((data as any).chest) meas.push({ name: 'Chest', value: (data as any).chest });
        if ((data as any).hip) meas.push({ name: 'Hip', value: (data as any).hip });
        if ((data as any).bicep) meas.push({ name: 'Bicep', value: (data as any).bicep });
        if ((data as any).neck) meas.push({ name: 'Neck', value: (data as any).neck });
        if ((data as any).collar) meas.push({ name: 'Collar', value: (data as any).collar });
        if ((data as any).sleeve) meas.push({ name: 'Sleeve', value: (data as any).sleeve });
        if ((data as any).notes) meas.push({ name: 'Notes', value: (data as any).notes });
        setMeasurements(meas);
        
        // Load existing images from DB
        if (data.measurementImages) {
          try {
            const imageUrls = JSON.parse(data.measurementImages);
            setExistingMeasurementImageUrls(Array.isArray(imageUrls) ? imageUrls : []);
          } catch (e) {
            console.error('Failed to parse measurement images:', e);
          }
        }
        if (data.clothImages) {
          try {
            const imageUrls = JSON.parse(data.clothImages);
            setExistingClothImageUrls(Array.isArray(imageUrls) ? imageUrls : []);
          } catch (e) {
            console.error('Failed to parse cloth images:', e);
          }
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

      // Upload new images to Cloudinary if there are any
      let measurementImageUrls: string[] = [];
      let clothImageUrls: string[] = [];

      try {
        if (measurementImages.length > 0) {
          measurementImageUrls = await uploadImages(measurementImages, 'tailor-app/measurements');
        }
        if (clothImages.length > 0) {
          clothImageUrls = await uploadImages(clothImages, 'tailor-app/cloths');
        }
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        alert('Failed to upload images. Please check your Cloudinary configuration.');
        setSubmitting(false);
        return;
      }

      // Combine existing images (that weren't deleted) with new uploads
      const finalMeasurementImages = [...existingMeasurementImageUrls, ...measurementImageUrls];
      const finalClothImages = [...existingClothImageUrls, ...clothImageUrls];

      const updateData = {
        clothType: selectedClothType,
        stitchingType: formData.stitchingType,
        measurementsGiven: formData.measurementsGiven,
        numberOfItems: formData.numberOfItems,
        charge: formData.charge,
        deliveryDate: formData.deliveryDate,
        waist: measurements.find(m => m.name === 'Waist')?.value || null,
        length: measurements.find(m => m.name === 'Length')?.value || null,
        shoulderWidth: measurements.find(m => m.name === 'Shoulder Width')?.value || null,
        chest: measurements.find(m => m.name === 'Chest')?.value || null,
        hip: measurements.find(m => m.name === 'Hip')?.value || null,
        bicep: measurements.find(m => m.name === 'Bicep')?.value || null,
        neck: measurements.find(m => m.name === 'Neck')?.value || null,
        collar: measurements.find(m => m.name === 'Collar')?.value || null,
        sleeve: measurements.find(m => m.name === 'Sleeve')?.value || null,
        notes: measurements.find(m => m.name === 'Notes')?.value || null,
        measurementImages: finalMeasurementImages.length > 0 ? JSON.stringify(finalMeasurementImages) : null,
        clothImages: finalClothImages.length > 0 ? JSON.stringify(finalClothImages) : null,
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
                existingImageUrls={existingMeasurementImageUrls}
                initialValues={{
                  waist: measurements.find(m => m.name === 'Waist')?.value || '',
                  length: measurements.find(m => m.name === 'Length')?.value || '',
                  shoulderWidth: measurements.find(m => m.name === 'Shoulder Width')?.value || '',
                  chest: measurements.find(m => m.name === 'Chest')?.value || '',
                  hip: measurements.find(m => m.name === 'Hip')?.value || '',
                  bicep: measurements.find(m => m.name === 'Bicep')?.value || '',
                  neck: measurements.find(m => m.name === 'Neck')?.value || '',
                  collar: measurements.find(m => m.name === 'Collar')?.value || '',
                  sleeve: measurements.find(m => m.name === 'Sleeve')?.value || '',
                  notes: measurements.find(m => m.name === 'Notes')?.value || '',
                }}
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
              isSubmitting={submitting}
              clothImages={clothImages}
              setClothImages={setClothImages}
              existingClothImageUrls={existingClothImageUrls}
              setExistingClothImageUrls={setExistingClothImageUrls}
            />


          </>
        )}
      </div>
    </div>
  );

}
