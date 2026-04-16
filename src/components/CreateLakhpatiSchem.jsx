import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Installment options mapped by tenure (years)
// First option in each array is auto-selected when tenure changes
const TENURE_INSTALL_MAP = {
  "2": [3740, 2400],
  "3": [2400, 1650],
  "4": [1650, 1350],
  "5": [1350],
};

const MATURITY_AMOUNT = 100000;

export default function CreateLakhpatiSchem() {
  const { customerId, savingAc } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tenure: "3",
    tenureType: "year",
    InstallAmount: String(TENURE_INSTALL_MAP["3"][0]), // auto-select first for default tenure
    maturityAmount: MATURITY_AMOUNT,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTenureChange = (e) => {
    const selectedTenure = e.target.value;
    const firstInstall = TENURE_INSTALL_MAP[selectedTenure]?.[0] ?? "";

    setFormData((prev) => ({
      ...prev,
      tenure: selectedTenure,
      InstallAmount: String(firstInstall), // auto-select first installment
    }));

    if (errors.tenure) {
      setErrors((prev) => ({ ...prev, tenure: "" }));
    }
  };

  const handleInstallChange = (e) => {
    setFormData((prev) => ({ ...prev, InstallAmount: e.target.value }));
    if (errors.InstallAmount) {
      setErrors((prev) => ({ ...prev, InstallAmount: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenure) {
      newErrors.tenure = "Tenure is required";
    }

    if (!formData.InstallAmount) {
      newErrors.InstallAmount = "Installment Amount is required";
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/createLakhpati/${customerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("✅ Lakhpati Yojana created successfully!");
        const defaultTenure = "3";
        setFormData({
          tenure: defaultTenure,
          tenureType: "year",
          InstallAmount: String(TENURE_INSTALL_MAP[defaultTenure][0]),
          maturityAmount: MATURITY_AMOUNT,
        });
        navigate(-1);
      } else {
        alert(response.data.message || "Failed to create Lakhpati Yojana.");
      }
    } catch (error) {
      console.error("Error creating Lakhpati:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create Lakhpati Yojana. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const installOptions = formData.tenure ? TENURE_INSTALL_MAP[formData.tenure] ?? [] : [];

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
        <h2 className="text-2xl font-bold text-gray-800">
          Create Lakhpati Yojana
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tenure */}
        <div>
          <label
            htmlFor="tenure"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tenure *
          </label>
          <select
            id="tenure"
            name="tenure"
            value={formData.tenure}
            onChange={handleTenureChange}
            className={`w-full px-4 py-2 border rounded-lg ${errors.tenure ? "border-red-500" : "border-gray-300"
              }`}
          >
            <option value="">-- Select Tenure --</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
            <option value="5">5 Years</option>
          </select>
          {errors.tenure && (
            <p className="mt-1 text-sm text-red-600">{errors.tenure}</p>
          )}
        </div>

        {/* Tenure Type — hidden, always "year" */}
        <input type="hidden" name="tenureType" value="year" />

        {/* Installment Amount — options driven by tenure */}
        <div>
          <label
            htmlFor="InstallAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Installment Amount (₹) *
          </label>
          <select
            id="InstallAmount"
            name="InstallAmount"
            value={formData.InstallAmount}
            onChange={handleInstallChange}
            disabled={!formData.tenure}
            className={`w-full px-4 py-2 border rounded-lg bg-white ${errors.InstallAmount ? "border-red-500" : "border-gray-300"
              } ${!formData.tenure ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {installOptions.length === 0 && (
              <option value="">-- Select Tenure First --</option>
            )}
            {installOptions.map((amt) => (
              <option key={amt} value={String(amt)}>
                ₹{amt.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
          {errors.InstallAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.InstallAmount}</p>
          )}
        </div>

        {/* Maturity Amount — read-only, fixed at ₹1,00,000 */}
        <div>
          <label
            htmlFor="maturityAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maturity Amount (₹)
          </label>
          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-medium select-none">
            ₹{MATURITY_AMOUNT.toLocaleString("en-IN")}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Fixed maturity amount — cannot be changed.
          </p>
          {/* Hidden input so value is included in formData */}
          <input type="hidden" name="maturityAmount" value={MATURITY_AMOUNT} />
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
            {isSubmitting ? "Creating..." : "Create Lakhpati Yojana"}
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

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Preview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Tenure:</span>
            <span className="ml-2">
              {formData.tenure || "-"} {formData.tenureType}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Saving Account:</span>
            <span className="ml-2">{savingAc || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Installment:</span>
            <span className="ml-2">
              ₹
              {formData.InstallAmount
                ? parseInt(formData.InstallAmount).toLocaleString("en-IN")
                : "-"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Maturity:</span>
            <span className="ml-2">
              ₹{MATURITY_AMOUNT.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}