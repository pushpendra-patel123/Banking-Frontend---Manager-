import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const EditAreaManager = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [previewSignature, setPreviewSignature] = useState(null);
  const [newSignatureFile, setNewSignatureFile] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    mode: "onBlur",
  });

  const token = sessionStorage.getItem("token");

  // Fetch area manager details
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/areaManager/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const manager = res.data?.data || res.data;

        reset({
          name: manager.name || "",
          email: manager.email || "",
          contact: manager.contact || "",
          address: manager.address || "",
          managerId: manager.managerId || "",
          gender: manager.gender || "",
          AadharNo: manager.AadharNo || "",
          panCard: manager.panCard || "",
        });

        if (manager.signature) {
          setPreviewSignature({
            url: manager.signature,
            type: manager.signature.endsWith(".pdf") ? "application/pdf" : "image",
            name: "Current Signature",
          });
        }
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch manager data";
        setBackendError(errorMsg);
        console.error("Error fetching manager:", err);
      })
      .finally(() => setLoading(false));
  }, [id, reset, token]);

  const onSubmit = async (data) => {
    setBackendError(null);
    setIsUpdating(true);

    // Trim all string fields
    const trimmedData = {};
    for (let key in data) {
      if (typeof data[key] === "string") {
        trimmedData[key] = data[key].trim();
      } else {
        trimmedData[key] = data[key];
      }
    }

    const formData = new FormData();

    // Append trimmed fields
    Object.entries(trimmedData).forEach(([key, value]) => {
      if (key !== "signature") {
        formData.append(key, value);
      }
    });

    // Only append signature if a new file was selected
    if (newSignatureFile) {
      formData.append("signature", newSignatureFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/areaManager/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success || response.status === 200) {
        alert("✅ Area Manager updated successfully!");
        navigate(-1);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Failed to update manager";
      setBackendError(errorMsg);
      console.error("Error updating manager:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-yellow-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading manager data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white px-4 py-6">
      <div className="w-full max-w-4xl mx-auto shadow-lg rounded-xl bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white hover:text-red-600 p-2 rounded-full border-2 border-white transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-2xl font-bold tracking-wide text-white">
              Edit Area Manager
            </h2>
          </div>
          <button
            type="submit"
            form="editAgentForm"
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-lg shadow-md active:scale-95 transition-all"
            disabled={isSubmitting || isUpdating}
          >
            {isSubmitting || isUpdating ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Backend Error Alert */}
        {backendError && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p className="text-sm mt-1">{backendError}</p>
          </div>
        )}

        <form
          id="editAgentForm"
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: "Name can only contain letters and spaces",
                },
                validate: {
                  noLeadingTrailingSpaces: (value) =>
                    value?.trim() === value ||
                    "Name cannot have leading or trailing spaces",
                  noMultipleSpaces: (value) =>
                    !/\s{2,}/.test(value) ||
                    "Name cannot have multiple consecutive spaces",
                },
              })}
              placeholder="Enter Name"
              className={`w-full p-3 border ${errors.name ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter Email"
              className={`w-full p-3 border ${errors.email ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter valid 10-digit mobile number",
                },
              })}
              placeholder="Enter Contact"
              className={`w-full p-3 border ${errors.contact ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.contact.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register("gender", {
                required: "Gender is required",
              })}
              className={`w-full p-3 border ${errors.gender ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
                maxLength: {
                  value: 200,
                  message: "Address cannot exceed 200 characters",
                },
              })}
              placeholder="Enter Complete Address"
              rows="3"
              className={`w-full p-3 border ${errors.address ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200 resize-none`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Aadhaar No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              {...register("AadharNo", {
                required: "Aadhaar is required",
                pattern: {
                  value: /^[2-9]\d{11}$/,
                  message: "Must be 12 digits (cannot start with 0 or 1)",
                },
              })}
              placeholder="Enter Aadhaar No"
              className={`w-full p-3 border ${errors.AadharNo ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
            />
            {errors.AadharNo && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.AadharNo.message}
              </p>
            )}
          </div>

          {/* PAN */}
          <div>
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              PAN Card <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              {...register("panCard", {
                required: "PAN is required",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format (e.g., ABCDE1234F)",
                },
              })}
              placeholder="Enter PAN Card"
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              className={`w-full p-3 border ${errors.panCard ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200 uppercase`}
            />
            {errors.panCard && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.panCard.message}
              </p>
            )}
          </div>

          {/* Signature */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-sm mb-2 text-gray-700">
              Signature (Re-upload to change) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              {...register("signature", {
                validate: {
                  fileSize: (files) => {
                    if (!files?.[0]) return true;
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    return (
                      files[0].size <= maxSize ||
                      "File size must be less than 5MB"
                    );
                  },
                  fileType: (files) => {
                    if (!files?.[0]) return true;
                    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
                    return (
                      validTypes.includes(files[0].type) ||
                      "Only JPEG, PNG, or PDF files are allowed"
                    );
                  },
                },
              })}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewSignatureFile(file);
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPreviewSignature({
                      url: event.target.result,
                      type: file.type,
                      name: file.name,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`w-full p-3 border-2 border-dashed ${errors.signature ? "border-red-400" : "border-gray-300"
                } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 cursor-pointer hover:border-yellow-400`}
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPEG, PNG, PDF (Max 5MB)
            </p>
            {errors.signature && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.signature.message}
              </p>
            )}

            {/* Preview */}
            {previewSignature && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-2">
                  Preview: {previewSignature.name}
                </p>
                {previewSignature.type === "application/pdf" ||
                  previewSignature.url.endsWith(".pdf") ? (
                  <embed
                    src={previewSignature.url}
                    type="application/pdf"
                    className="h-40 w-full border rounded"
                  />
                ) : (
                  <img
                    src={previewSignature.url}
                    alt="Signature Preview"
                    className="h-32 border rounded object-contain"
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAreaManager;