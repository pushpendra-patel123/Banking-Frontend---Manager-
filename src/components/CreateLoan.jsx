import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateLoan() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loanPrincipalAmount: "",
    loanTenure: "",
    loanTenureType: "month",
    loanEMIFrequency: "monthly",
    loanType: "personal",
    loanInterestRate: "10",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const token = sessionStorage.getItem("token");

  const validateForm = () => {
    const newErrors = {};

    // Loan Amount
    if (!formData.loanPrincipalAmount) {
      newErrors.loanPrincipalAmount = "Loan amount is required";
    } else if (Number(formData.loanPrincipalAmount) <= 0) {
      newErrors.loanPrincipalAmount = "Loan amount must be greater than 0";
    }

    // Loan Tenure
    if (!formData.loanTenure) {
      newErrors.loanTenure = "Loan tenure is required";
    } else if (Number(formData.loanTenure) <= 0) {
      newErrors.loanTenure = "Tenure must be greater than 0";
    }

    // Interest Rate
    if (!formData.loanInterestRate) {
      newErrors.loanInterestRate = "Interest rate is required";
    } else if (Number(formData.loanInterestRate) <= 0) {
      newErrors.loanInterestRate = "Interest rate must be greater than 0%";
    } else if (Number(formData.loanInterestRate) > 99.99) {
      newErrors.loanInterestRate = "Interest rate cannot exceed 99.99%";
    }

    // Tenure Type
    if (!formData.loanTenureType) {
      newErrors.loanTenureType = "Please select tenure type";
    }

    // EMI Frequency
    if (!formData.loanEMIFrequency) {
      newErrors.loanEMIFrequency = "Please select EMI frequency";
    }

    // Loan Type
    if (!formData.loanType) {
      newErrors.loanType = "Please select loan type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      console.log("Submitting Loan:", formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createLoan/${customerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Loan created successfully!");
        setFormData({
          loanPrincipalAmount: "",
          loanTenure: "",
          loanTenureType: "year",
          loanEMIFrequency: "monthly",
          loanType: "personal",
          loanInterestRate: "10",
        });
        navigate(-1);
      } else {
        alert(response.data.message || "Failed to create loan.");
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create loan. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Create Loan Account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Principal Amount */}
        <div>
          <label
            htmlFor="loanPrincipalAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Loan Amount (₹) *
          </label>
          <input
            type="number"
            id="loanPrincipalAmount"
            name="loanPrincipalAmount"
            value={formData.loanPrincipalAmount}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.loanPrincipalAmount ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter principal amount"
          />
          {errors.loanPrincipalAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.loanPrincipalAmount}
            </p>
          )}
        </div>

        {/* Loan Tenure */}
        <div>
          <label
            htmlFor="loanTenure"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Loan Tenure *
          </label>
          {/* <input
            type="number"
            id="loanTenure"
            name="loanTenure"
            value={formData.loanTenure}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.loanTenure ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter tenure (e.g. 12)"
          /> */}


          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.loanTenure}
            onChange={(e) => {
              const raw = e.target.value;

              // Show error if decimal point is typed
              if (raw.includes(".")) {
                setErrors((prev) => ({
                  ...prev,
                  loanTenure: "Decimal values are not allowed in RD Tenure",
                }));
                return; // Don't update the value
              }

              // Strip any non-digit characters and limit to 3 digits
              const value = raw.replace(/\D/g, "").slice(0, 3);

              setFormData((prev) => ({ ...prev, loanTenure: value }));

              // Clear error if valid
              if (value) {
                setErrors((prev) => ({ ...prev, loanTenure: "" }));
              }
            }}
            maxLength={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rdTenure ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter tenure in months (e.g., 36)"
          />


          {errors.loanTenure && (
            <p className="mt-1 text-sm text-red-600">{errors.loanTenure}</p>
          )}
        </div>


        {/* Loan Tenure Type */}
        <div>
          <label
            htmlFor="loanTenureType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tenure Type *
          </label>
          <select
            id="loanTenureType"
            name="loanTenureType"
            value={formData.loanTenureType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="month">Months</option>
            <option value="year">Years</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="loanInterestRate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Loan Interest Rate *
          </label>

          <input
            type="text"
            id="loanInterestRate"
            name="loanInterestRate"
            inputMode="decimal"
            value={formData.loanInterestRate}
            onChange={(e) => {
              let value = e.target.value;

              // ✅ allow only numbers + one decimal
              if (!/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
                setErrors((prev) => ({
                  ...prev,
                  loanInterestRate: "Only format like 10.55 allowed",
                }));
                return;
              }

              // ✅ max 99.99
              if (Number(value) > 99.99) {
                setErrors((prev) => ({
                  ...prev,
                  loanInterestRate: "Max value 99.99 allowed",
                }));
                return;
              }

              setFormData((prev) => ({
                ...prev,
                loanInterestRate: value,
              }));

              // clear error
              setErrors((prev) => ({
                ...prev,
                loanInterestRate: "",
              }));
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.loanInterestRate ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter interest rate (e.g., 10.5)"
          />

          {errors.loanInterestRate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.loanInterestRate}
            </p>
          )}
        </div>


        {/* EMI Frequency */}
        <div>
          <label
            htmlFor="loanEMIFrequency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            EMI Frequency *
          </label>
          <select
            id="loanEMIFrequency"
            name="loanEMIFrequency"
            value={formData.loanEMIFrequency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Loan Type */}
        <div>
          <label
            htmlFor="loanType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Loan Type *
          </label>
          <select
            id="loanType"
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Loan Type</option>
            <option value="gold">Gold Loan (सोने तारण कर्ज)</option>
            <option value="vehicle">Vehicle Loan (वाहन कर्ज)</option>
            <option value="household">Household Appliance Loan (घरेलू उपकरण कर्ज)</option>
            <option value="business">Business Loan (व्यवसायिक कर्ज)</option>
            <option value="salary">Salary-backed Loan (पगारतारण कर्ज)</option>
            <option value="regular">Regular Loan (नियमित कर्ज)</option>
            <option value="savingsGroup">Savings Group Loan (बचत गट)</option>
            <option value="mortgage">Mortgage Loan (तारण कर्ज)</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isSubmitting ? "Creating Loan..." : "Create Loan"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Preview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Amount:</span>
            <span className="ml-2">
              ₹
              {formData.loanPrincipalAmount
                ? parseInt(formData.loanPrincipalAmount).toLocaleString("en-IN")
                : "-"}
            </span>
          </div>
          <div>
            <span className="font-medium">Tenure:</span>
            <span className="ml-2">
              {formData.loanTenure || "-"} {formData.loanTenureType}
            </span>
          </div>
          <div>
            <span className="font-medium">EMI Frequency:</span>
            <span className="ml-2">{formData.loanEMIFrequency || "-"}</span>
          </div>
          <div>
            <span className="font-medium">Type:</span>
            <span className="ml-2">{formData.loanType || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
