import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote } from 'lucide-react';
import axios from 'axios';

export default function PigmyEmiPayModal({ pigmy, customerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    pigMyAccountNumber: pigmy?.pigMyAccountNumber || '',
    transactionType: 'pigmy',
    amount: pigmy?.pigmyDailyDeposit || '',
    mode: 'bankTransfer'
  });

  const [errors, setErrors] = useState({});

  const paymentModes = [
    { value: 'upi', label: 'UPI', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'card', label: 'Debit/Credit Card', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'cash', label: 'Cash', icon: <Banknote className="w-4 h-4" /> },
    { value: 'cheque', label: 'Cheque', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'bankTransfer', label: 'Bank Transfer', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const formatIndianCurrency = (num) => new Intl.NumberFormat('en-IN').format(num);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const token = sessionStorage.getItem("token");
  const validateForm = () => {
    const newErrors = {};
    if (!formData.pigMyAccountNumber) newErrors.pigMyAccountNumber = 'Pigmy Account Number is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.mode) newErrors.mode = 'Payment mode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/pigmyEmiTransaction`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        alert('Pigmy EMI processed successfully! Approve the Payment to complete the Transaction');
        closeModal();
      } else {
        alert(response.data.message || 'Failed to process Pigmy EMI.');
      }
    } catch (error) {
      console.error('Error processing Pigmy EMI:', error);
      alert(error.response?.data?.message || 'Failed to process Pigmy EMI. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    setFormData({
      customerId: customerId || '',
      pigMyAccountNumber: pigmy?.pigMyAccountNumber || '',
      transactionType: 'pigmy',
      amount: pigmy?.pigmyDailyDeposit || '',
      mode: ''
    });
    setErrors({});
  };

  return (
    <div className="p-8">
      <div className="text-center">
        <button
          onClick={openModal}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Banknote className="w-5 h-5 mr-2" />
          Pay Pigmy EMI
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Pay Pigmy EMI</h3>
                <p className="text-sm text-gray-600 mt-1">Make your Pigmy EMI payment</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pigmy Account Number *</label>
                <input
                  type="text"
                  name="pigMyAccountNumber"
                  value={formData.pigMyAccountNumber}
                  disabled
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${errors.pigMyAccountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., PGMY1758346416975"
                />
                {errors.pigMyAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.pigMyAccountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  Pigmy
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}

                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                {formData.amount && (
                  <p className="mt-1 text-sm text-gray-500">
                    Amount: ₹{formatIndianCurrency(formData.amount)}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentModes.map((mode) => (
                    <label
                      key={mode.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.mode === mode.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={mode.value}
                        checked={formData.mode === mode.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        {mode.icon}
                        <span className="ml-2 text-sm font-medium">{mode.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.mode && <p className="mt-1 text-sm text-red-600">{errors.mode}</p>}
              </div> */}
            </form>

            {/* Summary */}
            <div className="px-6 pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  {/* <div className="flex justify-between">
                    <span className="text-green-700">Customer ID:</span>
                    <span className="font-medium text-green-800">{formData.customerId || '-'}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-green-700">Pigmy Account:</span>
                    <span className="font-medium text-green-800">{formData.pigMyAccountNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount:</span>
                    <span className="font-medium text-green-800">
                      {formData.amount ? `₹${formatIndianCurrency(formData.amount)}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment Mode:</span>
                    <span className="font-medium text-green-800 capitalize">{formData.mode || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Pay EMI'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
