import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const AddAreaManager = () => {
    const navigate = useNavigate();
    const [previewSignature, setPreviewSignature] = useState(null);
    const [newSignatureFile, setNewSignatureFile] = useState(null);
    const [backendError, setBackendError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({
        mode: "onBlur", // Validate on blur for better UX
    });

    const token = sessionStorage.getItem("token");
    const managerId = JSON.parse(sessionStorage.getItem("user"))?._id;

    // Watch PAN field to auto-uppercase
    const panValue = watch("panCard");

    const onSubmit = async (data) => {
        // Clear previous backend errors
        setBackendError(null);
        setIsLoading(true);

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
        for (let key in trimmedData) {
            if (key === "signature" && data.signature?.[0]) {
                formData.append("signature", data.signature[0]);
            } else if (key !== "signature") {
                formData.append(key, trimmedData[key]);
            }
        }

        formData.append("managerId", managerId);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/areaManager/register`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data?.success || response.status === 201) {
                alert("✅ Area Manager added successfully!");
                navigate(-1);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data?.errors?.[0]?.message ||
                error.message ||
                "Error while adding manager";

            setBackendError(errorMessage);
            console.error("Error adding manager:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white px-4 py-6">
            <div className="w-full max-w-4xl mx-auto shadow-lg rounded-xl bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-white hover:bg-white hover:text-red-600 p-2 rounded-full border-2 border-white transition-colors"
                            title="Back"
                        >
                            <FaArrowLeft />
                        </button>
                        <h2 className="text-2xl font-bold tracking-wide text-white">
                            Add Area Manager
                        </h2>
                    </div>
                    <button
                        type="submit"
                        form="addAgentForm"
                        className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-lg shadow-md active:scale-95 transition-all"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* Backend Error Alert */}
                {backendError && (
                    <div className="mx-6 mt-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
                        <p className="font-semibold">Error:</p>
                        <p className="text-sm mt-1">{backendError}</p>
                    </div>
                )}

                <form id="addAgentForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8 grid md:grid-cols-2 gap-8">
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
                                placeholder="Enter Manager Name"
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
                                Email Address <span className="text-red-500">*</span>
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
                                placeholder="Enter Email Address"
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
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={10}
                                {...register("contact", {
                                    required: "Contact number is required",
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: "Enter valid 10-digit mobile number (starts with 6-9)",
                                    },
                                })}
                                placeholder="Enter Contact Number"
                                className={`w-full p-3 border ${errors.contact ? "border-red-400" : "border-gray-300"
                                    } rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200`}
                            />
                            {errors.contact && (
                                <p className="text-red-500 text-xs mt-1 font-medium">
                                    {errors.contact.message}
                                </p>
                            )}
                        </div>

                        {/* Aadhaar */}
                        <div>
                            <label className="block font-semibold text-sm mb-2 text-gray-700">
                                Aadhaar Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={12}
                                {...register("AadharNo", {
                                    required: "Aadhaar number is required",
                                    pattern: {
                                        value: /^[2-9]\d{11}$/,
                                        message: "Must be 12 digits (cannot start with 0 or 1)",
                                    },
                                })}
                                placeholder="Enter Aadhaar Number"
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
                                    required: "PAN Card is required",
                                    pattern: {
                                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                        message: "Invalid PAN format (e.g., ABCDE1234F)",
                                    },
                                })}
                                placeholder="Enter PAN Card Number"
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

                        {/* Gender */}
                        <div>
                            <label className="block font-semibold text-sm mb-2 text-gray-700">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("gender", {
                                    required: "Gender selection is required",
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

                        {/* Signature */}
                        <div className="md:col-span-2">
                            <label className="block font-semibold text-sm mb-2 text-gray-700">
                                Signature (Image/PDF) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                {...register("signature", {
                                    required: "Signature upload is required",
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
                                    {previewSignature.type === "application/pdf" ? (
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAreaManager;