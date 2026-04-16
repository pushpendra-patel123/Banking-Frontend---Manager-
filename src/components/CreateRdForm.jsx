import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateRDForm() {
  const { customerId, savingAc } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rdTenure: "",
    type: "standardRd",
    rdInstallAmount: "",
    rdInterestRate: "6", // backend expects rdInterestRate
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInterestRateChange = (e) => {
    const raw = e.target.value;

    if (raw === "" || raw === ".") {
      setFormData((prev) => ({ ...prev, rdInterestRate: raw }));
      setErrors((prev) => ({ ...prev, rdInterestRate: "" }));
      return;
    }

    if (!/^\d*\.?\d*$/.test(raw)) return;

    const parts = raw.split(".");
    const intPart = parts[0];
    const decPart = parts[1];

    if (intPart.length > 2) {
      setErrors((prev) => ({
        ...prev,
        rdInterestRate: "Interest rate cannot exceed 99.99%",
      }));
      return;
    }

    if (decPart !== undefined && decPart.length > 2) return;

    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue) && numericValue > 99.99) {
      setErrors((prev) => ({
        ...prev,
        rdInterestRate: "Interest rate cannot exceed 99.99%",
      }));
      setFormData((prev) => ({ ...prev, rdInterestRate: raw }));
      return;
    }

    setFormData((prev) => ({ ...prev, rdInterestRate: raw }));
    setErrors((prev) => ({ ...prev, rdInterestRate: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rdTenure) {
      newErrors.rdTenure = "RD Tenure is required";
    } else if (formData.rdTenure <= 0) {
      newErrors.rdTenure = "RD Tenure must be greater than 0";
    }

    if (!formData.rdInstallAmount) {
      newErrors.rdInstallAmount = "Installment Amount is required";
    } else if (Number(formData.rdInstallAmount) < 500) {
      newErrors.rdInstallAmount = "Minimum installment amount is ₹500";
    }

    if (!formData.rdInterestRate || formData.rdInterestRate <= 0) {
      newErrors.rdInterestRate = "Interest rate must be greater than 0";
    } else if (Number(formData.rdInterestRate) > 99.99) {
      newErrors.rdInterestRate = "Interest rate cannot exceed 99.99%";
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
      console.log("Submitting RD:", formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createRD/${customerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Recurring Deposit created successfully!");
        setFormData({
          rdTenure: "",
          type: "standardRd",
          savingAccountNo: "",
          rdInstallAmount: "",
        });
        navigate(-1);
      } else {
        alert(response.data.message || "Failed to create Recurring Deposit.");
      }
    } catch (error) {
      console.error("Error creating RD:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create Recurring Deposit. Please try again."
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
        <h2 className="text-2xl font-bold text-gray-800">Create RD Account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* RD Tenure */}
        <div>
          <label
            htmlFor="rdTenure"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            RD Tenure (months) *
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.rdTenure}
            onChange={(e) => {
              const raw = e.target.value;

              // Show error if decimal point is typed
              if (raw.includes(".")) {
                setErrors((prev) => ({
                  ...prev,
                  rdTenure: "Decimal values are not allowed in RD Tenure",
                }));
                return; // Don't update the value
              }

              // Strip any non-digit characters and limit to 3 digits
              const value = raw.replace(/\D/g, "").slice(0, 3);

              setFormData((prev) => ({ ...prev, rdTenure: value }));

              // Clear error if valid
              if (value) {
                setErrors((prev) => ({ ...prev, rdTenure: "" }));
              }
            }}
            maxLength={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rdTenure ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter tenure in months (e.g., 36)"
          />
          {errors.rdTenure && (
            <p className="mt-1 text-sm text-red-600">{errors.rdTenure}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            RD Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standardRd">Standard RD</option>
            <option value="premiumRd">Premium RD</option>
            <option value="seniorCitizenRd">Senior Citizen RD</option>
          </select>
        </div>

        {/* RD Installment Amount */}
        <div>
          <label
            htmlFor="rdInstallAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Installment Amount (₹) *
          </label>
          <input
            type="number"
            id="rdInstallAmount"
            name="rdInstallAmount"
            value={formData.rdInstallAmount}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rdInstallAmount ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter installment amount (e.g., 5000)"
          />
          {errors.rdInstallAmount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.rdInstallAmount}
            </p>
          )}
          {formData.rdInstallAmount && (
            <p className="mt-1 text-sm text-gray-500">
              Amount in words: ₹
              {parseInt(formData.rdInstallAmount).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* RD Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%) *
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="rdInterestRate"
            value={formData.rdInterestRate}
            onChange={handleInterestRateChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rdInterestRate ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="e.g. 8.50"
          />
          {errors.rdInterestRate ? (
            <p className="mt-1 text-sm text-red-600">{errors.rdInterestRate}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Max 99.99%, up to 2 decimal places (e.g. 12.25)
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating RD...
              </div>
            ) : (
              "Create Recurring Deposit"
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
            <span className="ml-2">{formData.rdTenure || "-"} month</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Type:</span>
            <span className="ml-2">{formData.type || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Saving Account:</span>
            <span className="ml-2">{savingAc || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Installment:</span>
            <span className="ml-2">
              ₹
              {formData.rdInstallAmount
                ? parseInt(formData.rdInstallAmount).toLocaleString("en-IN")
                : "-"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Interest Rate:</span>
            <span className="ml-2">{formData.rdInterestRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
