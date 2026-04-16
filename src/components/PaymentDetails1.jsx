import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft, FaUser, FaCreditCard, FaUserTie,
  FaCalendarAlt, FaRupeeSign, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaIdCard
} from "react-icons/fa";

const PaymentDetails1 = () => {
  const [paymentData, setTransactions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = sessionStorage.getItem("token");

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/transaction/getByid/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setTransactions(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch transactions");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  /* ─── Reusable row ─────────────────────────────────────────── */
  const InfoRow = ({ icon: Icon, label, value, valueClass = "text-gray-800" }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="mt-0.5 shrink-0">
        <Icon className="text-gray-400 text-base" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`font-medium text-sm break-words ${valueClass}`}>{value || "N/A"}</p>
      </div>
    </div>
  );

  /* ─── Section card ─────────────────────────────────────────── */
  const SectionCard = ({ icon: Icon, iconBg, iconColor, title, children }) => (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className={`${iconBg} p-2.5 rounded-full shrink-0`}>
          <Icon className={`${iconColor} text-lg`} />
        </div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Coloured strip */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full transition-colors shrink-0"
            >
              <FaArrowLeft className="text-white text-sm" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">Payment Details</h1>
              <p className="text-orange-100 text-sm mt-0.5">
                Transaction ID: <span className="font-mono">{paymentData?.transactionId || "—"}</span>
              </p>
            </div>
          </div>

          {/* Status banner */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <FaCreditCard className="text-white text-xl shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">Transaction Status</p>
                  <p className="text-blue-100 text-xs">Current payment status</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-white text-sm font-semibold ${getStatusColor(paymentData?.status)}`}>
                {paymentData?.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Three columns ───────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Customer */}
          <SectionCard icon={FaUser} iconBg="bg-blue-100" iconColor="text-blue-600" title="Customer Details">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={paymentData?.customerId?.picture || "https://via.placeholder.com/120?text=C"}
                  alt="Customer"
                  className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/120?text=C"; }}
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
            </div>

            <div className="space-y-2">
              <InfoRow icon={FaUser} label="Name" value={paymentData?.customerId?.name} />
              <InfoRow icon={FaPhone} label="Phone" value={paymentData?.customerId?.contact} />
              <InfoRow icon={FaMapMarkerAlt} label="Address" value={paymentData?.customerId?.address} />
              <InfoRow icon={FaIdCard} label="Saving Account Number" value={paymentData?.customerId?.savingAccountNumber} />
              <InfoRow icon={FaIdCard} label="Customer ID" value={paymentData?.customerId?.CustomerId} />
              <InfoRow
                icon={FaRupeeSign}
                label="Account Balance"
                value={`₹${paymentData?.customerId?.savingAccountBalance ?? 0}`}
              />
            </div>
          </SectionCard>

          {/* Transaction */}
          <SectionCard icon={FaCreditCard} iconBg="bg-green-100" iconColor="text-green-600" title="Transaction Details">
            {/* Amount highlight */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaRupeeSign className="text-base" />
                <p className="text-xs opacity-80">Amount</p>
              </div>
              <p className="text-2xl font-bold">{formatAmount(paymentData?.amount)}</p>
            </div>

            <div className="space-y-2">
              <InfoRow icon={FaCreditCard} label="Payment Mode" value={paymentData?.mode ? paymentData.mode.charAt(0).toUpperCase() + paymentData.mode.slice(1) : undefined} />
              <InfoRow icon={FaCalendarAlt} label="Transaction Date" value={formatDate(paymentData?.date)} />
              <InfoRow icon={FaIdCard} label="Transaction ID" value={paymentData?.transactionId} />

              {/* Ledger */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <FaIdCard className="text-blue-400 mt-0.5 shrink-0 text-base" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-600 mb-0.5">Ledger Number</p>
                  <p className="font-semibold text-sm text-blue-800 break-words">{paymentData?.accountNumber || "N/A"}</p>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <FaIdCard className="text-blue-400 mt-0.5 shrink-0 text-base" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Account Type</p>
                  <p className="font-semibold text-sm text-red-700 break-words">{paymentData?.schemeType || "N/A"}</p>
                </div>
              </div>

              {/* Transaction Type */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <FaIdCard className="text-blue-400 mt-0.5 shrink-0 text-base" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Transaction Type</p>
                  <p className="font-semibold text-sm text-gray-800 break-words">{paymentData?.transactionType || "N/A"}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Agent */}
          <SectionCard icon={FaUserTie} iconBg="bg-purple-100" iconColor="text-purple-600" title="Agent Details">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="https://avatar.iran.liara.run/public/boy"
                  alt="Agent"
                  className="w-24 h-24 rounded-full border-4 border-purple-200 object-cover"
                  onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy"; }}
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <FaUserTie className="text-white" style={{ fontSize: 9 }} />
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <InfoRow icon={FaUserTie} label="Agent Name" value={paymentData?.agentId?.name} />
              <InfoRow icon={FaPhone} label="Phone" value={paymentData?.agentId?.contact} />
              <InfoRow icon={FaEnvelope} label="Email" value={paymentData?.agentId?.email} />
              <InfoRow icon={FaMapMarkerAlt} label="Address" value={paymentData?.agentId?.address} />
            </div>
          </SectionCard>
        </div>

        {/* ── Footer action ────────────────────────────────────── */}
        <div className="bg-white shadow-md rounded-xl p-5 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200"
          >
            <FaArrowLeft className="text-xs" />
            Back to Transactions
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentDetails1;