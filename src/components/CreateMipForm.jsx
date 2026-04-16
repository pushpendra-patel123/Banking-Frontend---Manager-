import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateMipForm() {
  const { customerId, savingAc } = useParams();
  const [formData, setFormData] = useState({
    tenure: 12,
    tenureType: 'month',
    type: '12 Month MIP',
    depositAmount: '',
    interestRate: '8',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

    // Block more than 2 digits before decimal (e.g. "666", "100")
    if (intPart.length > 2) {
      setErrors(prev => ({
        ...prev,
        interestRate: 'Interest rate cannot exceed 99.99%',
      }));
      return;
    }

    // Block more than 2 decimal places
    if (decPart !== undefined && decPart.length > 2) return;

    const numericValue = parseFloat(raw);

    // Show error if value exceeds 99.99
    if (!isNaN(numericValue) && numericValue > 99.99) {
      setErrors(prev => ({
        ...prev,
        interestRate: 'Interest rate cannot exceed 99.99%',
      }));
      // Still update so user sees what they typed, but keep the error
      setFormData(prev => ({ ...prev, interestRate: raw }));
      return;
    }

    setFormData(prev => ({ ...prev, interestRate: raw }));
    setErrors(prev => ({ ...prev, interestRate: '' }));
  };

  const MIN_DEPOSIT = import.meta.env.VITE_MINIMUM_MIP_AMOUNT || 50000;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenure || formData.tenure <= 0) {
      newErrors.tenure = 'Tenure must be greater than 0';
    }

    if (!formData.depositAmount || formData.depositAmount <= 0) {
      newErrors.depositAmount = 'Deposit Amount must be greater than 0';
    } else if (Number(formData.depositAmount) < MIN_DEPOSIT) {
      newErrors.depositAmount = `Minimum deposit amount is ₹${MIN_DEPOSIT}`;
    }

    if (!formData.interestRate || formData.interestRate <= 0) {
      newErrors.interestRate = 'Interest rate must be greater than 0';
    } else if (Number(formData.interestRate) > 99.99) {
      newErrors.interestRate = 'Interest rate cannot exceed 99.99%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        tenure: formData.tenure,
        tenureType: formData.tenureType,
        depositAmount: formData.depositAmount,
        interestRate: formData.interestRate,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createMIP/${customerId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("MIP created successfully!");
        setFormData({
          tenure: 12,
          tenureType: 'month',
          type: '12 Month MIP',
          depositAmount: '',
          interestRate: '8',
        });
        Navigate(-1);
      } else {
        alert(response.data.message || "Failed to create MIP.");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create MIP. Try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <h2 className="text-2xl font-bold text-gray-800">Create MIP</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenure *
          </label>
          <select
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tenure ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select tenure</option>
            <option value="9">9 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
          </select>
          {errors.tenure && <p className="mt-1 text-sm text-red-600">{errors.tenure}</p>}
        </div>

        {/* Tenure Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenure Type *
          </label>
          <select
            name="tenureType"
            value={formData.tenureType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Months</option>
          </select>
        </div>

        {/* Deposit Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount (₹) *
          </label>
          <input
            type="number"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.depositAmount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter deposit amount"
          />
          {errors.depositAmount && <p className="mt-1 text-sm text-red-600">{errors.depositAmount}</p>}
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleInterestRateChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.interestRate ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g. 8.50"
          />
          {errors.interestRate
            ? <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
            : <p className="mt-1 text-xs text-gray-400">Max 99.99%, up to 2 decimal places (e.g. 12.22)</p>
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
            {isSubmitting ? "Creating MIP..." : "Create MIP"}
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
            <span className="ml-2">{formData.tenure} {formData.tenureType}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Type:</span>
            <span className="ml-2">{formData.type}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Customer Saving Ac:</span>
            <span className="ml-2">{savingAc}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Deposit Amount:</span>
            <span className="ml-2">₹{formData.depositAmount ? parseInt(formData.depositAmount).toLocaleString('en-IN') : '-'}</span>
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