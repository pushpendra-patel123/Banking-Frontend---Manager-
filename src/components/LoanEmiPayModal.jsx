import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote } from 'lucide-react';
import axios from 'axios';

export default function LoanEmiPayModal({ loan, customerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    loanAccountNumber: loan?.loanAccountNumber || '',
    transactionType: 'emi',
    amount: loan?.loanEMIAmount || '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loanAccountNumber) {
      newErrors.loanAccountNumber = 'Loan Account Number is required';
    } else if (!formData.loanAccountNumber.startsWith('LN')) {
      newErrors.loanAccountNumber = 'Loan Account Number must start with "LN"';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount < 100) {
      newErrors.amount = 'Minimum EMI amount is ₹100';
    }

    if (!formData.mode) {
      newErrors.mode = 'Payment mode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const token = sessionStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Processing Loan EMI:', formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/loanEmiTransaction`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert('Loan EMI processed successfully! Approve the Payment to complete the Transaction');
        closeModal();
      } else {
        alert(response.data.message || 'Failed to process Loan EMI.');
      }
    } catch (error) {
      console.error('Error processing Loan EMI:', error);
      alert(
        error.response?.data?.message ||
        'Failed to process Loan EMI. Please try again.'
      );
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
      loanAccountNumber: loan?.loanAccountNumber || '',
      transactionType: 'emi',
      amount: loan?.loanEMIAmount || '',
      mode: ''
    });
    setErrors({});
  };

  return (
    <div className="p-8">
      {/* Trigger Button */}
      <div className="text-center">
        <button
          onClick={openModal}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Banknote className="w-5 h-5 mr-2" />
          Pay Loan EMI
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Pay Loan EMI</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Make your Loan EMI payment
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>




            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">


              <div>
                <label
                  htmlFor="loan type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Loan Type
                </label>
                <input
                  type="text"
                  id="loanType"
                  name="loanAccountNumber"
                  value={loan.loanType + " " + "Loan"}
                  disabled

                  className={`w-full px-4 py-3 text-red capitalize border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.loanAccountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., LN1758360434566"
                />

              </div>
              {/* Loan Account Number */}
              <div>
                <label
                  htmlFor="loanAccountNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Loan Account Number *
                </label>
                <input
                  type="text"
                  id="loanAccountNumber"
                  name="loanAccountNumber"
                  value={formData.loanAccountNumber}
                  disabled
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.loanAccountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., LN1758360434566"
                />
                {errors.loanAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.loanAccountNumber}
                  </p>
                )}
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  EMI
                </div>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  EMI Amount (₹) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  disabled
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., 54166.67"
                  min="100"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
                {formData.amount && (
                  <p className="mt-1 text-sm text-gray-500">
                    Amount: ₹{formatIndianCurrency(formData.amount)}
                  </p>
                )}
              </div>

              {/* Payment Mode */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentModes.map((mode) => (
                    <label
                      key={mode.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.mode === mode.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
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
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600">{errors.mode}</p>
                )}
              </div> */}
            </form>

            {/* Transaction Summary */}
            <div className="px-6 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3">
                  Transaction Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Customer ID:</span>
                    <span className="font-medium text-blue-800">
                      {formData.customerId || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Loan Account:</span>
                    <span className="font-medium text-blue-800">
                      {formData.loanAccountNumber || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-medium text-blue-800">
                      {formData.amount
                        ? `₹${formatIndianCurrency(formData.amount)}`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Payment Mode:</span>
                    <span className="font-medium text-blue-800 capitalize">
                      {formData.mode || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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
