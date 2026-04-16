import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaToggleOn, FaUsers, FaHeart, FaBirthdayCake, FaPiggyBank, FaChartLine, FaIdCard, FaCreditCard, FaPen, FaCheck, FaVenus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

function ViewAreaManager() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ URL se id le rahe hai
  const [customer, setManager] = useState(null); // manager ka data yaha aayega
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token")

  // ✅ API Call
  useEffect(() => {
    const fetchManager = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/areaManager/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // API endpoint (check backend route)
        setManager(res.data.data || res.data); // response ke hisaab se adjust karein
      } catch (error) {
        console.error("Error fetching manager data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!customer) {
    return <p className="text-center mt-10 text-red-500">Manager not found!</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br p-4 from-orange-50 to-amber-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-md shadow-md px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-black p-2 hover:bg-orange-100 rounded-full transition-colors"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Area Manager Details</h1>
        </div>

        <div className="mx-auto p-6">
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8 px-4">
            <div className="mx-auto">

              {/* ================= Manager Info ================= */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 p-3 rounded-full mr-4 flex items-center justify-center">
                    <FaUser className="text-orange-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Manager Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Name */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                      <FaUser className="text-orange-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Name</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                      <FaEnvelope className="text-orange-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Email Address</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                      <FaPhone className="text-orange-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Contact Number</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.contact || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                      <FaMapMarkerAlt className="text-orange-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Address</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                      <FaVenus className="text-orange-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Gender</span>
                      <p className="text-gray-800 font-semibold capitalize">
                        {customer?.gender || "N/A"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* ================= Account Info ================= */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 flex items-center justify-center">
                    <FaIdCard className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Account & Document Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Aadhaar */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                      <FaIdCard className="text-blue-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Aadhaar Number</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.AadharNo || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* PAN */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                      <FaCreditCard className="text-blue-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">PAN Card</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.panCard || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                      <FaPen className="text-blue-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Signature</span>
                      <div className="mt-2">
                        {customer?.signature ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <FaCheck className="text-green-500" />
                            <span className="text-green-600 font-medium">Uploaded</span>
                            <a
                              href={customer?.signature}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              View
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            <span className="text-red-600 font-medium">Not Uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registration Date */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                      <FaCalendarAlt className="text-blue-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Registration Date</span>
                      <p className="text-gray-800 font-semibold">
                        {customer?.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                      <FaToggleOn className="text-blue-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Account Status</span>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${!customer?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {customer?.isActive ? "Active" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAreaManager;
