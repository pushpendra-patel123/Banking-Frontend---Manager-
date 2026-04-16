import React, { useState } from "react";
import axios from "axios";
import { FaWallet, FaTimes, FaCheckCircle } from "react-icons/fa";

export default function MipEmiPayModal({ mipScheme, customerId, savingAc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    const expectedAmount = Number(mipScheme?.mipDepositAmount) || 0;

    const [formData, setFormData] = useState({
        amount: String(expectedAmount),
        mode: "bankTransfer",
        mipAccountNumber: mipScheme?.mipAccountNumber || "",
    });

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

    const handleAmountChange = (e) => {
        const value = e.target.value;

        // Allow only numeric input
        if (value === "" || /^\d+$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                amount: value,
            }));

            if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: "" }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.amount) {
            newErrors.amount = "Amount is required";
        } else if (Number(formData.amount) !== expectedAmount) {
            newErrors.amount = `Amount must be exactly ₹${expectedAmount.toLocaleString("en-IN")}`;
        } else if (Number(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (!formData.mode) {
            newErrors.mode = "Payment mode is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setErrors({});
            const token = sessionStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/transactionSchemes/mipTransaction`,
                {
                    customerId,
                    mipAccountNumber: mipScheme?.mipAccountNumber,
                    amount: Number(formData.amount),
                    mode: formData.mode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSuccessMessage("✅ MIP deposit recorded successfully! please accept the transaction to complete the Payment.");
                setFormData({
                    amount: String(expectedAmount),
                    mode: "bankTransfer",
                    mipAccountNumber: mipScheme?.mipAccountNumber || "",
                });

                // Close modal after 2 seconds
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccessMessage(null);
                }, 2000);
            } else {
                setErrors({
                    form: response.data.message || "Failed to record MIP deposit",
                });
            }
        } catch (err) {
            setErrors({
                form: err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Error processing MIP payment",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsOpen(true);
        setErrors({});
        setSuccessMessage(null);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setErrors({});
        setSuccessMessage(null);
        setFormData({
            amount: String(expectedAmount),
            mode: "online",
            mipAccountNumber: mipScheme?.mipAccountNumber || "",
        });
    };

    // Check if account is closed or matured
    const isAccountClosed =
        mipScheme?.mipAccountStatus === "closed" ||
        mipScheme?.mipAccountStatus === "matured";

    return (
        <>
            <button
                onClick={handleOpenModal}
                disabled={isAccountClosed}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition duration-200 ${isAccountClosed
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
            >
                <FaWallet className="text-lg" />
                Pay MIP Deposit
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaWallet className="mr-2 text-green-600" /> Pay MIP Deposit
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                                <FaCheckCircle className="text-lg" />
                                {successMessage}
                            </div>
                        )}

                        {errors.form && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* MIP Account Number - Read Only */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    MIP Account Number
                                </label>
                                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-medium">
                                    {mipScheme?.mipAccountNumber || "-"}
                                </div>
                            </div>

                            {/* Saving Account - Read Only */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Saving Account
                                </label>
                                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-medium">
                                    {savingAc || "-"}
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deposit Amount (₹) *
                                </label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition ${errors.amount ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter amount"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Required amount: ₹{expectedAmount.toLocaleString("en-IN")}
                                </p>
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                )}
                            </div>

                            {/* Payment Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Payment Mode *
                                </label>
                                <select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition ${errors.mode ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="bankTransfer">bankTransfer</option>

                                </select>
                                {errors.mode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mode}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {loading ? "Processing..." : "Pay Deposit"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                        {/* Information */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> The deposit amount will be recorded and pending approval. Ensure you provide the exact amount required for this MIP installment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}