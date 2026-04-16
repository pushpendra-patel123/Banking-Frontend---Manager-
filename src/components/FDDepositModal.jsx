import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Banknote } from 'lucide-react';
import axios from 'axios';

export default function FDDepositModal({ fd, customerId, savingAc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    fdAccountNumber: fd?.fdAccountNumber || '',
    transactionType: 'deposit',
    amount: fd.fdPrincipalAmount,
    mode: 'bankTransfer'
  });
  const [errors, setErrors] = useState({});

  const paymentModes = [
    { value: 'upi', label: 'UPI', icon: <Smartphone className="w-4 h-4" /> },
    // { value: 'netbanking', label: 'Net Banking', icon: <Building className="w-4 h-4" /> },
    { value: 'card', label: 'Debit/Credit Card', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'cash', label: 'Cash', icon: <Banknote className="w-4 h-4" /> },
    { value: 'cheque', label: 'Cheque', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'bankTransfer', label: 'BankTransfer', icon: <CreditCard className="w-4 h-4" /> },
    // { value: 'neft', label: 'NEFT', icon: <Building className="w-4 h-4" /> },
    // { value: 'rtgs', label: 'RTGS', icon: <Building className="w-4 h-4" /> }
  ];

  const formatIndianCurrency = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // if (!formData.customerId) {
    //   newErrors.customerId = 'Customer ID is required';
    // } else if (formData.customerId.length < 10) {
    //   newErrors.customerId = 'Customer ID must be at least 10 characters';
    // }

    if (!formData.fdAccountNumber) {
      newErrors.fdAccountNumber = 'FD Account Number is required';
    } else if (!formData.fdAccountNumber.startsWith('FD')) {
      newErrors.fdAccountNumber = 'FD Account Number must start with "FD"';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount < 1000) {
      newErrors.amount = 'Minimum deposit amount is ₹1,000';
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Depositing to FD:", formData);

      // Actual API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/fdTransaction`, // 🔹 replace with your backend endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Deposit processed successfully! Approve the Payment to complete the transaction");
        closeModal();

        // Optionally refresh FD list after deposit
        // fetchCustomerDetails();
      } else {
        alert(response.data.message || "Failed to process deposit.");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert(
        error.response?.data?.message ||
        "Failed to process deposit. Please try again."
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
    // Reset form
    // setFormData({
    //   customerId: '',
    //   fdAccountNumber: '',
    //   transactionType: 'deposit',
    //   amount: '',
    //   mode: ''
    // });
    setErrors({});
    // setFdDepositModal()
  };

  return (
    <div className="p-8">
      {/* Trigger Button */}
      <div className="text-center">
        <button
          onClick={openModal}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Banknote className="w-5 h-5 mr-2" />
          Deposit to FD
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Deposit to Fixed Deposit</h3>
                <p className="text-sm text-gray-600 mt-1">Add funds to your FD account</p>
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
              {/* Customer ID */}


              {/* FD Account Number */}
              <div>
                <label htmlFor="fdAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  FD Account Number *
                </label>
                <input
                  type="text"
                  disabled
                  id="fdAccountNumber"
                  name="fdAccountNumber"
                  value={formData.fdAccountNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${errors.fdAccountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., FD1758346167890"
                />
                {errors.fdAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.fdAccountNumber}</p>
                )}
              </div>

              {/* Transaction Type (Read-only) */}
              <div>
                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  Deposit
                </div>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (₹) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  disabled
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., 1500000"
                  min="1000"
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
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
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
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600">{errors.mode}</p>
                )}
              </div> */}
            </form>

            {/* Transaction Summary */}
            <div className="px-6 pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Customer Saving Ac Number:</span>
                    <span className="font-medium text-green-800">
                      {savingAc || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">FD Account:</span>
                    <span className="font-medium text-green-800">
                      {formData.fdAccountNumber || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount:</span>
                    <span className="font-medium text-green-800">
                      {formData.amount ? `₹${formatIndianCurrency(formData.amount)}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment Mode:</span>
                    <span className="font-medium text-green-800 capitalize">
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
                  : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Process Deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}