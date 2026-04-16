import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatePigmyForm() {
  const { customerId, savingAc } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [formData, setFormData] = useState({
    type: "savings",
    pigmyDailyDeposit: "",
    pigMyTenure: "",
    pigMyTenureType: "month",
    interestRate: "6", // backend uses interestRate
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInterestRateChange = (e) => {
    const raw = e.target.value;

    if (raw === "" || raw === ".") {
      setFormData((prev) => ({ ...prev, interestRate: raw }));
      setErrors((prev) => ({ ...prev, interestRate: "" }));
      return;
    }

    if (!/^\d*\.?\d*$/.test(raw)) return;

    const parts = raw.split(".");
    const intPart = parts[0];
    const decPart = parts[1];

    if (intPart.length > 2) {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Interest rate cannot exceed 99.99%",
      }));
      return;
    }

    if (decPart !== undefined && decPart.length > 2) return;

    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue) && numericValue > 99.99) {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Interest rate cannot exceed 99.99%",
      }));
      setFormData((prev) => ({ ...prev, interestRate: raw }));
      return;
    }

    setFormData((prev) => ({ ...prev, interestRate: raw }));
    setErrors((prev) => ({ ...prev, interestRate: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pigmyDailyDeposit || formData.pigmyDailyDeposit <= 0) {
      newErrors.pigmyDailyDeposit = "Daily deposit must be greater than 0";
    }
    if (!formData.pigMyTenure || formData.pigMyTenure <= 0) {
      newErrors.pigMyTenure = "Tenure must be greater than 0";
    }
    if (!formData.interestRate || formData.interestRate <= 0) {
      newErrors.interestRate = "Interest rate must be greater than 0";
    } else if (Number(formData.interestRate) > 99.99) {
      newErrors.interestRate = "Interest rate cannot exceed 99.99%";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createPigmy/${customerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Pigmy account created successfully!");
        setFormData({
          type: "savings",
          pigmyDailyDeposit: "",
          pigMyTenure: "",
          pigMyTenureType: "month",
        });
        navigate(-1);
      } else {
        alert(response.data.message || "Failed to create Pigmy account.");
      }
    } catch (error) {
      console.error("Error creating Pigmy:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create Pigmy. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Create Pigmy  Account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block mb-2 font-medium">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="savings">Savings</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Daily Deposit */}
        <div>
          <label className="block mb-2 font-medium">
            Daily Deposit (₹) *
          </label>
          <input
            type="number"
            name="pigmyDailyDeposit"
            value={formData.pigmyDailyDeposit}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg ${errors.pigmyDailyDeposit ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter daily deposit"
          />
          {errors.pigmyDailyDeposit && (
            <p className="mt-1 text-sm text-red-600">
              {errors.pigmyDailyDeposit}
            </p>
          )}
        </div>

        {/* Tenure */}
        <div>
          <label className="block mb-2 font-medium">Tenure *</label>
          <select
            name="pigMyTenure"
            value={formData.pigMyTenure}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${errors.pigMyTenure ? "border-red-500" : "border-gray-300"
              }`}
          >
            <option value="">Select tenure</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>

          {errors.pigMyTenure && (
            <p className="mt-1 text-sm text-red-600">{errors.pigMyTenure}</p>
          )}
        </div>


        {/* Tenure Type */}
        <div>
          <label className="block mb-2 font-medium">Tenure Type *</label>
          <select
            name="pigMyTenureType"
            value={formData.pigMyTenureType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="month">Month(s)</option>
            {/* <option value="year">Year(s)</option>
            <option value="week">Week(s)</option> */}
          </select>
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.interestRate ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="e.g. 8.50"
          />
          {errors.interestRate ? (
            <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              Max 99.99%, up to 2 decimal places (e.g. 12.25)
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Creating..." : "Create Pigmy"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Preview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span>{" "}
            <span>{formData.type}</span>
          </div>
          <div>
            <span className="font-medium">Saving Account:</span>{" "}
            <span>{savingAc}</span>
          </div>
          <div>
            <span className="font-medium">Daily Deposit:</span>{" "}
            <span>
              ₹
              {formData.pigmyDailyDeposit
                ? parseInt(formData.pigmyDailyDeposit).toLocaleString("en-IN")
                : "-"}
            </span>
          </div>
          <div>
            <span className="font-medium">Tenure:</span>{" "}
            <span>
              {formData.pigMyTenure} {formData.pigMyTenureType}
            </span>
          </div>
          <div>
            <span className="font-medium">Interest Rate:</span>{" "}
            <span>{formData.interestRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
