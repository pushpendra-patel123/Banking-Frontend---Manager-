import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateFDForm() {

  const { customerId, savingAc } = useParams()
  const [formData, setFormData] = useState({
    fdTenure: 9,
    fdTenureType: 'month',
    type: '9M FD',
    interestRate: "8",
    fdDepositAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    // ✅ Sync FD Type with Tenure
    if (name === "fdTenure") {
      updatedData.type = `${value}M FD`; // e.g., 9 -> "9M FD"
    }

    setFormData(updatedData);

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Interest rate: allow typing like "12.22", block 3-digit integers like "666"
  const handleInterestRateChange = (e) => {
    const raw = e.target.value;

    // Allow empty string (clearing the field)
    if (raw === '' || raw === '.') {
      setFormData(prev => ({ ...prev, interestRate: raw }));
      setErrors(prev => ({ ...prev, interestRate: '' }));
      return;
    }

    // Only allow digits and a single decimal point
    if (!/^\d*\.?\d*$/.test(raw)) return;

    const parts = raw.split('.');
    const intPart = parts[0];
    const decPart = parts[1];

    // Block more than 2 digits before decimal (e.g., "100" becomes invalid, but "99.99" is OK)
    if (intPart.length > 2) {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Interest rate cannot exceed 99.99%",
      }));
      return;
    }

    // Block more than 2 decimal places
    if (decPart !== undefined && decPart.length > 2) return;

    const numericValue = parseFloat(raw);

    // Show error if value exceeds 99.99
    if (!isNaN(numericValue) && numericValue > 99.99) {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Interest rate cannot exceed 99.99%",
      }));
      // Still update so user sees what they typed, but keep the error
      setFormData(prev => ({ ...prev, interestRate: raw }));
      return;
    }

    setFormData(prev => ({ ...prev, interestRate: raw }));
    setErrors(prev => ({ ...prev, interestRate: '' }));
  };

  const MIN_FD_AMOUNT = import.meta.env.VITE_MINIMUM_FD_AMOUNT || 5000 // Minimum FD deposit amount
  console.log(MIN_FD_AMOUNT, formData.fdDepositAmount, "MIN_FD_AMOUNT")

  const validateForm = () => {
    const newErrors = {};

    // FD Tenure validation
    if (!formData.fdTenure) {
      newErrors.fdTenure = 'FD Tenure is required';
    } else if (formData.fdTenure <= 0) {
      newErrors.fdTenure = 'FD Tenure must be greater than 0';
    }

    // FD Deposit Amount validation
    if (!formData.fdDepositAmount) {
      newErrors.fdDepositAmount = 'Deposit Amount is required';
    } else if (formData.fdDepositAmount <= 0) {
      newErrors.fdDepositAmount = 'Deposit amount must be greater than 0';
    } else if (Number(formData.fdDepositAmount) < MIN_FD_AMOUNT) {
      newErrors.fdDepositAmount = `Minimum deposit amount is ₹${MIN_FD_AMOUNT}`;
    }

    // Interest Rate validation
    if (!formData.interestRate || formData.interestRate <= 0) {
      newErrors.interestRate = "Interest rate must be greater than 0";
    } else if (Number(formData.interestRate) > 99.99) {
      newErrors.interestRate = "Interest rate cannot exceed 99.99%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  console.log(errors, formData.fdDepositAmount < MIN_FD_AMOUNT)
  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(validateForm(), "validateForm()")
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting FD:", formData);

      // API call to create FD
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createFD/${customerId}`,
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Fixed Deposit created successfully!");
        // Reset form
        setFormData({
          fdTenure: 9,
          fdTenureType: "month",
          type: "9M FD",
          interestRate: "8",
          fdDepositAmount: "",
        });

        Navigate(-1)
      } else {
        alert(response.data.message || "Failed to create Fixed Deposit.");
      }
    } catch (error) {
      console.error("Error creating FD:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create Fixed Deposit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const numberToWords = (num) => {
    if (!num) return "";

    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
      if (n < 100000)
        return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
      if (n < 10000000)
        return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
      return inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000);
    };

    return inWords(num).trim() + " Only";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => Navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Create Fixed Deposit</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FD Tenure */}

        <div>
          <label
            htmlFor="fdTenure"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            FD Tenure *
          </label>
          <select
            id="fdTenure"
            name="fdTenure"
            value={formData.fdTenure}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fdTenure ? "border-red-500" : "border-gray-300"
              }`}
          >
            <option value="">Select tenure</option>
            <option value="9">9 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
            <option value="48">48 Months</option>
            <option value="60">60 Months</option>
            <option value="84">84 Months</option>
          </select>
          {errors.fdTenure && (
            <p className="mt-1 text-sm text-red-600">{errors.fdTenure}</p>
          )}
        </div>


        {/* FD Tenure Type */}
        <div>
          <label htmlFor="fdTenureType" className="block text-sm font-medium text-gray-700 mb-2">
            Tenure Type *
          </label>
          <select
            id="fdTenureType"
            name="fdTenureType"
            value={formData.fdTenureType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Months</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            FD Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
          >
            <option value={formData.type}>{formData.type}</option>
          </select>
        </div>

        {/* FD Deposit Amount */}
        <div>
          <label htmlFor="fdDepositAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount (₹) *
          </label>
          <input
            type="number"
            id="fdDepositAmount"
            name="fdDepositAmount"
            value={formData.fdDepositAmount}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fdDepositAmount ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter deposit amount (e.g., 10000)"
          />
          {errors.fdDepositAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.fdDepositAmount}</p>
          )}

          {formData.fdDepositAmount && (
            <p className="mt-1 text-sm text-gray-500">
              Amount in words: ₹ {numberToWords(Number(formData.fdDepositAmount))}
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInterestRateChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.interestRate ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g. 8.50"
          />
          {errors.interestRate
            ? <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
            : <p className="mt-1 text-xs text-gray-400">Max 15%, up to 2 decimal places (e.g. 12.22)</p>
          }
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating FD...
              </div>
            ) : (
              'Create Fixed Deposit'
            )}
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Preview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Tenure:</span>
            <span className="ml-2">{formData.fdTenure || '-'} {formData.fdTenureType}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Type:</span>
            <span className="ml-2">{formData.type || '-'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Customer Saving Ac -:</span>
            <span className="ml-2">{savingAc || '-'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Amount:</span>
            <span className="ml-2">₹{formData.fdDepositAmount ? parseInt(formData.fdDepositAmount).toLocaleString('en-IN') : '-'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Interest Rate:</span>
            <span className="ml-2">{formData.interestRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}