import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaTimes, FaMapMarkerAlt, FaExclamationTriangle, FaUserTie, FaCalendarAlt, FaToggleOn, FaUsers, FaHeart, FaBirthdayCake, FaPiggyBank, FaChartLine, FaIdCard, FaCreditCard, FaPen, FaCheck, FaVenus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FDDepositModal from "./FDDepositModal";
import RDEmiPayModal from "./RDEmiPayModal";
import LoanEmiPayModal from "./LoanEmiPayModal";
import PigmyEmiPayModal from "./PigmyEmiPayModal";
import FDMaturityModal from "../modal/FDMaturityModal";
import RdMaturityModal from "../modal/RdMaturityModal";
import PigmyMaturityModal from "../modal/PigmyMaturityModal";
import LakhpatiEmiPayModal from "../modal/LakhpatiEmiPayModal";
import LakhpatiMaturityModal from "../modal/LakhpatiMaturityModal";
import MipMaturityModal from "../modal/MipMaturityModal";
import MipEmiPayModal from "../modal/MipEmiPayModal";
// import { apiCustomerUrl } from "../../api/apiRoutes";

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token")

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/customer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`

        },
      });
      if (res.data.success) {
        setCustomer(res.data.data); // customer info
        setAccounts(res.data.data.accounts || []); // accounts list
      } else {
        setError("Customer not found");
      }
    } catch (err) {
      setError("Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch customer details
  useEffect(() => {

    fetchDetails();
  }, [id]);


  const [fdDepositModal, setFdDepositModal] = useState(false)


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      {/* Header */}
      <div className="bg-gradient-to-br rounded-md from-orange-500 via-red-500 to-red-600 shadow-md px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-black p-2 hover:bg-orange-100 rounded-full transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
      </div>

      <div className=" mx-auto p-6">
        {/* Customer Info Card */}
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8 px-4">
          <div className=" mx-auto">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-1 rounded-full mr-4 w-20 h-20 flex items-center justify-center overflow-hidden">
                  <img
                    src={customer?.picture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Customer Information</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Details */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaUser className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Name</span>
                    <p className="text-gray-800 font-semibold">{customer?.name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Email Address</span>
                    <p className="text-gray-800 font-semibold">{customer?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Contact Number</span>
                    <p className="text-gray-800 font-semibold">{customer?.contact || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-orange-500 mr-3 mt-1" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Address</span>
                    <p className="text-gray-800 font-semibold">{customer?.address || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaVenus className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Gender</span>
                    <p className="text-gray-800 font-semibold capitalize">{customer?.gender || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaUserTie className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Agent</span>
                    <p className="text-gray-800 font-semibold">{customer?.agentId?.name || "Not Assigned"}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaUserTie className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Manager</span>
                    <p className="text-gray-800 font-semibold">{customer?.managerId?.name || "Not Assigned"}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaUserTie className="text-orange-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Area Manager</span>
                    <p className="text-gray-800 font-semibold">{customer?.areaManagerId?.name || "Not Assigned"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Document Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaIdCard className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Account & Document Details</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaPiggyBank className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Saving Account Number</span>
                    <p className="text-gray-800 font-semibold">{customer?.savingAccountNumber || "Not Assigned"}</p>
                  </div>
                </div>

                {/* Saving Account Balance */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaPiggyBank className="text-green-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Saving Account Balance</span>
                    <p className="text-gray-800 font-semibold">
                      {customer?.savingAccountBalance != null
                        ? `₹${Number(customer.savingAccountBalance).toLocaleString('en-IN')}`
                        : "0"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaIdCard className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Aadhaar Number</span>
                    <p className="text-gray-800 font-semibold">
                      {customer?.AadharNo || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaIdCard className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Customer Id</span>
                    <p className="text-gray-800 font-semibold">
                      {customer.CustomerId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaCreditCard className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">PAN Card</span>
                    <p className="text-gray-800 font-semibold">
                      {customer?.panCard || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaPen className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Signature</span>
                    <div className="mt-2">
                      {customer?.signature ? (
                        <div className="flex items-center space-x-2">
                          <FaCheck className="text-green-500" />
                          <span className="text-green-600 font-medium">Uploaded</span>
                          <a href={customer?.signature} target="blank" className="text-blue-500 hover:text-blue-700 underline text-sm">
                            View
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FaTimes className="text-red-500" />
                          <span className="text-red-600 font-medium">Not Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Opening Date</span>
                    <p className="text-gray-800 font-semibold">
                      {
                        customer?.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                          : "N/A"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FaToggleOn className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-600">Account Status</span>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer?.savingAccountStatus == 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {customer?.savingAccountStatus == "active" ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nominee Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaUsers className="text-green-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Nominee Information</h2>
              </div>

              {customer?.NomineeDetails ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Nominee Name</span>
                      <p className="text-gray-800 font-semibold">{customer.NomineeDetails.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaHeart className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Relation</span>
                      <p className="text-gray-800 font-semibold capitalize">{customer.NomineeDetails.relation || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaBirthdayCake className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Age</span>
                      <p className="text-gray-800 font-semibold">{customer.NomineeDetails.age || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Date of Birth</span>
                      <p className="text-gray-800 font-semibold">
                        {customer.NomineeDetails.dob ? new Date(customer.NomineeDetails.dob).toLocaleDateString('en-IN') : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Email</span>
                      <p className="text-gray-800 font-semibold">{customer.NomineeDetails.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaPhone className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Mobile Number</span>
                      <p className="text-gray-800 font-semibold">{customer.NomineeDetails.mobile || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaIdCard className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Aadhaar Number</span>
                      <p className="text-gray-800 font-semibold">
                        {customer.NomineeDetails.AadharNo || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaCreditCard className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">PAN Card</span>
                      <p className="text-gray-800 font-semibold">
                        {customer.NomineeDetails.panCard || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-1">
                    <FaMapMarkerAlt className="text-green-500 mr-3 mt-1" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-600">Address</span>
                      <p className="text-gray-800 font-semibold">{customer.NomineeDetails.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No nominee information available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FD Schemes Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-green-100 p-3 flex items-center gap-2 rounded-full mr-4">
              <FaPiggyBank className="text-green-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">Fixed Deposit Schemes</h3>
            </div>



            {customer?.fdSchemes?.length > 0 &&
              <div className="flex gap-2 items-center">
                {/* FD Deposit Button/Modal */}
                <Link
                  to={`/create-fd/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Create New FD +
                </Link>

                {/* Payment Details Link */}
                <Link
                  to={`/coustomers/paymentdetails/${id}/FD`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Payment Details
                </Link>

              </div>

            }
          </div>

          {customer?.fdSchemes?.length > 0 ? (
            <>

              <div className="grid gap-6">
                {customer?.fdSchemes?.length > 0 ? (
                  customer.fdSchemes.map((fd, i) => (
                    <div
                      key={i}
                      className="border-2 border-green-200 rounded-xl p-6 bg-green-50 hover:shadow-lg transition-shadow"
                    >
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">FD Account No</span>
                            <p className="text-lg font-bold text-gray-800">{fd.fdAccountNumber || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Principal Amount</span>
                            <p className="text-xl font-bold text-green-600">
                              ₹{fd.fdPrincipalAmount ? Number(fd.fdPrincipalAmount).toLocaleString("en-IN") : "0"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Deposit Amount</span>
                            <p className="text-lg font-semibold text-gray-800">
                              ₹{fd?.fdDepositAmount
                                ? Number(fd.fdDepositAmount).toLocaleString("en-IN")
                                : "0"}
                            </p>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                            <p className="text-lg font-bold text-blue-600">{fd.fdInterestRate || 0}% p.a.</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Tenure</span>
                            <p className="text-lg font-semibold text-gray-800">
                              {fd.fdTenure || "N/A"} {fd.fdTenureType || ""}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Opening Date</span>
                            <p className="text-lg font-semibold text-gray-800">
                              {fd.fdOpeningDate ? new Date(fd.fdOpeningDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",      // "Jun"
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true         // 12-hour format with AM/PM
                              }) : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                            <p className="text-lg font-semibold text-gray-800">
                              {fd.fdMaturityDate ? new Date(fd.fdMaturityDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",      // "Jun"
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true         // 12-hour format with AM/PM
                              }) : "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                            <p className="text-xl font-bold text-green-600">
                              ₹{fd.fdMaturityAmount ? Number(fd.fdMaturityAmount).toLocaleString("en-IN") : "0"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${fd.fdAccountStatus === "active"
                                ? "bg-green-200 text-green-800"
                                : fd.fdAccountStatus === "matured"
                                  ? "bg-blue-200 text-blue-800"
                                  : fd.fdAccountStatus === "pending"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                            >
                              {fd.fdAccountStatus || "Unknown"}
                              {fd.fdCloseDate && (
                                <span className="block text-xs font-normal text-gray-700">
                                  {new Date(fd.fdCloseDate).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",      // "Jun"
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true         // 12-hour format with AM/PM
                                  })}
                                </span>
                              )}
                            </span>


                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {fd.fdDepositAmount == 0 &&
                        <div className="mt-6 flex justify-left text-left">
                          <FDDepositModal fd={fd} customerId={customer._id} savingAc={customer.savingAccountNumber} />
                        </div>


                      }

                      {fd.fdAccountStatus !== "closed" && fd.fdDepositAmount > 0 &&
                        <div className="mt-6 flex justify-left text-left">
                          <FDMaturityModal customer={customer} fdAccountNumber={fd.fdAccountNumber} />
                        </div>
                      }
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No FD Schemes found.</p>
                )}
              </div>

            </>
          )


            : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No Fixed Deposit Schemes Found</h4>
                <p className="text-gray-500 mb-6">This customer doesn't have any FD schemes yet.</p>

                {/* Create FD Link/Button */}
                <div className="mt-6">
                  <Link

                    to={`/create-fd/${customer.CustomerId}/${customer.savingAccountNumber}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Fixed Deposit
                  </Link>
                </div>

                {/* Alternative: If you prefer a simple text link */}
                {/* 
  <div className="mt-6">
    <a 
      href="/create-fd" 
      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
    >
      + Create your first Fixed Deposit
    </a>
  </div>
  */}
              </div>
            )}
        </div>

        {/* RD Schemes Section */}
        <div className="bg-white rounded-2xl mb-8 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 p-3 flex gap-3 items-center rounded-full mr-4">
              <FaChartLine className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">Recurring Deposit Schemes</h3>
            </div>

            {customer?.rdSchemes?.length > 0 &&
              <div className="flex gap-2 items-center">

                <Link
                  to={`/create-rd/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New RD
                </Link>

                <Link
                  to={`/coustomers/paymentdetails/${id}/RD`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Payment Details
                </Link>

              </div>
            }
          </div>

          {customer?.rdSchemes?.length > 0 ? (
            <div className="grid gap-6">
              {customer.rdSchemes.map((rd, i) => (
                <div key={i} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Account No</span>
                        <p className="text-lg font-bold text-gray-800">{rd.rdAccountNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Installment Amount</span>
                        <p className="text-xl font-bold text-purple-600">₹{Number(rd.rdInstallAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Installments</span>
                        <p className="text-lg font-semibold text-gray-800">{rd.rdTotalInstallments || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Installments Left</span>
                        <p className="text-lg font-semibold text-gray-800">{rd.rdTotalInstallments - rd.rdTotalDepositedInstallment || 0}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                        <p className="text-lg font-bold text-blue-600">{rd.rdInterestRate}% p.a.</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdOpeningDate ? new Date(rd.rdOpeningDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdMaturityDate ? new Date(rd.rdMaturityDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Last Emi Paid</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdLastEmiDate ? new Date(rd.rdLastEmiDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Total DepositedtAmount</span>
                        <p className="text-lg font-bold text-blue-600">₹{Number(rd.rdTotalDepositedtAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Total DepositedInstallment</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdTotalDepositedInstallment || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Tenure </span>
                        <p className="text-lg font-semibold text-gray-800">
                          {(rd.rdTenure && rd.rdTenureType) ? `${rd.rdTenure} ${rd.rdTenureType}` : "N/A"}

                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">Next Emi Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdNextEmiDate ? new Date(rd.rdNextEmiDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-xl font-bold text-purple-600">₹{Number(rd.rdMaturityAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${rd.rdAccountStatus === "active"
                          ? "bg-green-200 text-green-800"
                          : rd.rdAccountStatus === "matured"
                            ? "bg-blue-200 text-blue-800"
                            : rd.rdAccountStatus === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                          {rd.rdAccountStatus}
                          {rd.rdCloseDate && (
                            <span className="block text-xs font-normal text-gray-700">
                              {new Date(rd.rdCloseDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",      // "Jun"
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true         // 12-hour format with AM/PM
                              })}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="mt-6 flex gap-2">
                    {rd.rdAccountStatus !== "closed" && rd.rdAccountStatus !== "matured" &&
                      <div className="mt-6 flex justify-left text-left">
                        <RDEmiPayModal rd={rd} customerId={customer._id} savingAc={customer.savingAccountNumber} />
                      </div>


                    }

                    {rd.rdAccountStatus !== "closed" && rd.rdTotalDepositedtAmount > 0 &&
                      <div className="mt-6 flex justify-left text-left">
                        <RdMaturityModal customer={customer} rdAccountNumber={rd.rdAccountNumber} />
                      </div>
                    }
                  </div>
                </div>


              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Recurring Deposit Schemes Found</h4>
              <p className="text-gray-500">This customer doesn't have any RD schemes yet.</p>

              <div className="mt-6">
                <Link
                  to={`/create-rd/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Recurring Deposit
                </Link>
              </div>

            </div>


          )}
        </div>


        {/* Loan details if  */}

        <div className="bg-white rounded-2xl mb-8 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 p-3 flex gap-3 items-center rounded-full mr-4">
              <FaChartLine className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">Loan </h3>
            </div>

            {customer?.loans?.length > 0 &&
              <div className="flex gap-2 items-center">

                <Link
                  to={`/create-loan/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Loan
                </Link>
                <Link
                  to={`/coustomers/paymentdetails/${id}/LOAN`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Payment Details
                </Link>

              </div>
            }
          </div>

          {customer?.loans?.length > 0 ? (
            <div className="grid gap-6">
              {customer.loans.map((loan, i) => (
                <div key={i} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Type</span>
                        <p className="text-lg font-bold text-gray-800">{loan.loanType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Account No</span>
                        <p className="text-lg font-bold text-gray-800">{loan.loanAccountNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan PrincipalAmount Amount</span>
                        <p className="text-xl font-bold text-purple-600">₹{Number(loan.loanPrincipalAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Emi Amount</span>
                        <p className="text-lg font-semibold text-gray-800">₹{Number(loan.loanEMIAmount).toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                        <p className="text-lg font-bold text-blue-600">{loan.loanInterestRate}% p.a.</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {loan.loanOpeningDate ? new Date(loan.loanOpeningDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Outstanding Emis</span>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{Number(loan.loanOutstandingAmount).toLocaleString("en-IN") || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Time period</span>
                        <p className="text-xl font-bold text-purple-600">{loan.loanTenure}-{loan.loanTenureType}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total Emi Amount Deposited</span>
                        <p className="text-lg font-bold text-blue-600">₹{Number(loan.loanTotalEmiDeposited).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total No. Emi Deposited</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {loan.loanTotalNumberOfEmiDeposited || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Emi Left </span>
                        <p className="text-lg font-semibold text-gray-800">
                          {loan.loanRemainingEmis || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Next Emi Date</span>
                        <p className="text-xl font-bold text-purple-600">{new Date(loan.loanNextEmiDate).toDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">

                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${loan.loanStatus === 'active'
                          ? 'bg-green-200 text-green-800'
                          : loan.loanStatus === 'closed'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-red-200 text-red-800'
                          }`}>
                          {loan.loanStatus}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="mt-6 flex justify-left text-left">
                    <LoanEmiPayModal loan={loan} customerId={customer._id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Loan Found</h4>
              <p className="text-gray-500">This customer doesn't have any LOAN  yet.</p>

              <div className="mt-6">
                <Link
                  to={`/create-loan/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Loan
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* pifmy if */}

        <div className="bg-white rounded-2xl mb-8 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 p-3 flex gap-3 items-center rounded-full mr-4">
              <FaChartLine className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">Pigmy Account </h3>
            </div>

            {customer?.pigmy?.length > 0 &&
              <div className="flex gap-1">


                <Link
                  to={`/create-pigmy/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Pigmy
                </Link>
                <Link
                  to={`/coustomers/paymentdetails/${id}/PIGMY`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Payment Details
                </Link>

              </div>
            }
          </div>

          {customer?.pigmy?.length > 0 ? (
            <div className="grid gap-6">
              {customer.pigmy.map((pigmy, i) => (
                <div key={i} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Pigmy Type</span>
                        <p className="text-lg font-bold text-gray-800">{pigmy.type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Pigmy Account No</span>
                        <p className="text-lg font-bold text-gray-800">{pigmy.pigMyAccountNumber}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">Pigmy Daily Deposit</span>
                        <p className="text-lg font-semibold text-gray-800">₹{Number(pigmy.pigmyDailyDeposit).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{Number(pigmy.pigMyMaturityAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                        <p className="text-lg font-bold text-blue-600">{pigmy.pigMyInterestRate}% p.a.</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Duration</span>
                        <p className="text-lg font-bold text-blue-600">{pigmy.pigMyTenure} Months</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {pigmy.pigMyOpeningDate ? new Date(pigmy.pigMyOpeningDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {pigmy.pigMyMaturityDate ? new Date(pigmy.pigMyMaturityDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>


                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total Installment Paid</span>
                        <p className="text-lg font-bold text-blue-600">₹{Number(pigmy.pigMyTotalDepositedAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total No. InstallMent Deposited</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {pigmy.pigMyTotalInstallmentDeposited || "N/A"}
                        </p>
                      </div>
                      {/* <div>
                                                <span className="text-sm font-medium text-gray-600">Total Emi Left </span>
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {loan.loanRemainingEmis || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Next Emi Date</span>
                                                <p className="text-xl font-bold text-purple-600">{new Date(loan.loanNextEmiDate).toDateString()}</p>
                                            </div> */}
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${pigmy.pigmyAccount === 'active'
                          ? 'bg-green-200 text-green-800'
                          : pigmy.pigmyAccount === 'matured'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-red-200 text-red-800'
                          }`}>
                          {pigmy.pigmyAccount}
                          {pigmy?.pigMyCloseDate && (
                            <span className="block text-xs font-normal text-gray-700">
                              {new Date(pigmy.pigMyCloseDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",      // "Jun"
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true         // 12-hour format with AM/PM
                              })}
                            </span>
                          )}
                        </span>
                      </div>

                    </div>

                    <div className="space-y-3">


                    </div>
                  </div>

                  <div className="mt-6 flex justify-left text-left">
                    {pigmy.pigmyAccount !== "closed" && pigmy.pigmyAccount !== "matured" &&
                      <PigmyEmiPayModal pigmy={pigmy} customerId={customer._id} />
                    }



                    {pigmy.pigmyAccount !== "closed" && pigmy.pigMyTotalDepositedAmount > 0 &&
                      <div className=" flex justify-left text-left">
                        <PigmyMaturityModal customer={customer} pigMyAccountNumber={pigmy.pigMyAccountNumber} />
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No PIGMY Deposit Schemes Found</h4>
              <p className="text-gray-500">This customer doesn't have any PIGMY schemes yet.</p>

              <Link
                to={`/create-pigmy/${customer.CustomerId}/${customer.savingAccountNumber}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Pigmy
              </Link>
            </div>
          )}
        </div>


        {/* if lakhpati  */}
        <div className="bg-white rounded-2xl mb-8 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 p-3 flex gap-3 items-center rounded-full mr-4">
              <FaChartLine className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">Lakhpati  Account </h3>
            </div>

            {customer?.lakhpatiSchemes?.length > 0 &&
              <div className="flex gap-1">


                <Link
                  to={`/create-lakhpati/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Lakhpati schems
                </Link>
                <Link
                  to={`/coustomers/paymentdetails/${id}/Lakhpati`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Payment Details
                </Link>

              </div>
            }
          </div>

          {customer?.lakhpatiSchemes?.length > 0 ? (
            <div className="grid gap-6">
              {customer.lakhpatiSchemes.map((lakhpatiSchemes, i) => (
                <div key={i} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      {/* <div>
                        <span className="text-sm font-medium text-gray-600">Pigmy Type</span>
                        <p className="text-lg font-bold text-gray-800">{lakhpatiSchemes.type}</p>
                      </div> */}
                      <div>
                        <span className="text-sm font-medium text-gray-600">Lakhpati Account No</span>
                        <p className="text-lg font-bold text-gray-800">{lakhpatiSchemes.lakhpatiYojanaAccountNumber}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">InstallMents Deposit Per Month</span>
                        <p className="text-lg font-semibold text-gray-800">₹{Number(lakhpatiSchemes.lakhpatiYojanaInstallAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{Number(lakhpatiSchemes.lakhpatiYojanaMaturityAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* <div>
                        <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                        <p className="text-lg font-bold text-blue-600">{pigmy.pigMyInterestRate}% p.a.</p>
                      </div> */}
                      <div>
                        <span className="text-sm font-medium text-gray-600">Duration</span>
                        <p className="text-lg font-bold text-blue-600">{lakhpatiSchemes.lakhpatiYojanaTenure} {lakhpatiSchemes.lakhpatiYojanaTenureType} </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {lakhpatiSchemes.lakhpatiYojanaOpeningDate ? new Date(lakhpatiSchemes.lakhpatiYojanaOpeningDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {lakhpatiSchemes.lakhpatiYojanaMaturityDate ? new Date(lakhpatiSchemes.lakhpatiYojanaMaturityDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>


                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total Installment Paid Amount</span>
                        <p className="text-lg font-bold text-blue-600">₹{Number(lakhpatiSchemes.lakhpatiYojanaTotalDepositedAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total No. InstallMent Deposited</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {lakhpatiSchemes.lakhpatiYojanaTotalDepositedInstallments || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-600">Next Emi Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {lakhpatiSchemes.lakhpatiYojnaNextEmiDate ? new Date(lakhpatiSchemes.lakhpatiYojnaNextEmiDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",      // "Jun"
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true         // 12-hour format with AM/PM
                          }) : "N/A"}
                        </p>
                      </div>
                      {/* <div>
                                                <span className="text-sm font-medium text-gray-600">Total Emi Left </span>
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {loan.loanRemainingEmis || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600">Next Emi Date</span>
                                                <p className="text-xl font-bold text-purple-600">{new Date(loan.loanNextEmiDate).toDateString()}</p>
                                            </div> */}
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${lakhpatiSchemes.lakhpatiYojanaAccountStatus === 'active'
                          ? 'bg-green-200 text-green-800'
                          : lakhpatiSchemes.lakhpatiYojanaAccountStatus === 'matured'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-red-200 text-red-800'
                          }`}>
                          {lakhpatiSchemes.lakhpatiYojanaAccountStatus}
                          {lakhpatiSchemes?.lakhpatiYojanaCloseDate && (
                            <span className="block text-xs font-normal text-gray-700">
                              {new Date(lakhpatiSchemes.lakhpatiYojanaCloseDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",      // "Jun"
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true         // 12-hour format with AM/PM
                              })}
                            </span>
                          )}
                        </span>
                      </div>

                    </div>

                    <div className="space-y-3">


                    </div>
                  </div>

                  <div className="mt-6 flex justify-left text-left">
                    {lakhpatiSchemes.lakhpatiYojanaAccountStatus !== "closed" && lakhpatiSchemes.lakhpatiYojanaAccountStatus !== "matured" &&
                      <LakhpatiEmiPayModal lakhpatiSchemes={lakhpatiSchemes} customerId={customer._id} savingAc={customer.savingAccountNumber} />
                    }



                    {lakhpatiSchemes.lakhpatiYojanaAccountStatus !== "closed" && lakhpatiSchemes.lakhpatiYojanaTotalDepositedAmount > 0 &&
                      <div className=" flex justify-left text-left">
                        <LakhpatiMaturityModal customer={customer} lakhpatiYojanaAccountNumber={lakhpatiSchemes.lakhpatiYojanaAccountNumber} />
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Lakhpati Deposit Schemes Found</h4>
              <p className="text-gray-500">This customer doesn't have any Lakhpati schemes yet.</p>

              <Link
                to={`/create-lakhpati/${customer._id}/${customer.savingAccountNumber}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Lakhpati
              </Link>
            </div>
          )}
        </div>
        {/* if MIP  */}


        <div className="bg-white rounded-2xl mb-8 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 p-3 flex gap-3 items-center rounded-full mr-4">
              <FaChartLine className="text-purple-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-800">MIP Account</h3>
            </div>

            {customer?.mipSchemes?.length > 0 && (
              <div className="flex gap-1">
                <Link
                  to={`/create-mip/${customer.CustomerId}/${customer.savingAccountNumber}`}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create New MIP Scheme
                </Link>

                <Link
                  to={`/coustomers/paymentdetails/${customer._id}/MIP`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Payment Details
                </Link>
              </div>
            )}
          </div>

          {customer?.mipSchemes?.length > 0 ? (
            <div className="grid gap-6">
              {customer.mipSchemes.map((mipScheme, i) => (
                <div
                  key={i}
                  className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-lg transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">MIP Account No</span>
                        <p className="text-lg font-bold text-gray-800">{mipScheme.mipAccountNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Deposit Amount</span>
                        <p className="text-lg font-semibold text-gray-800">₹{Number(mipScheme.mipDepositAmount).toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{Number(mipScheme.mipMaturityAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Duration</span>
                        <p className="text-lg font-bold text-blue-600">
                          {mipScheme.mipTenure} {mipScheme.mipTenureType}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {mipScheme.mipOpeningDate
                            ? new Date(mipScheme.mipOpeningDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {mipScheme.mipMaturityDate
                            ? new Date(mipScheme.mipMaturityDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Monthly Interest Pay</span>
                        <p className="text-lg font-bold text-blue-600">₹{mipScheme.mipMonthlyInterestPay}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${mipScheme.mipAccountStatus === "active"
                            ? "bg-green-200 text-green-800"
                            : mipScheme.mipAccountStatus === "matured"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-red-200 text-red-800"
                            }`}
                        >
                          {mipScheme.mipAccountStatus}
                          {mipScheme?.mipCloseDate && (
                            <span className="block text-xs font-normal text-gray-700">
                              {new Date(mipScheme.mipCloseDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-left text-left gap-4 items-center">
                    {mipScheme.mipAccountStatus == "pending" && mipScheme.mipTotalDepositedAmount == 0 &&
                      (
                        <MipEmiPayModal mipScheme={mipScheme} customerId={customer._id} savingAc={customer.savingAccountNumber} />
                      )}

                    {mipScheme.mipAccountStatus !== "closed" &&
                      mipScheme.mipDepositAmount > 0 && (
                        <MipMaturityModal mipScheme={mipScheme} customer={customer} />
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                No MIP Deposit Schemes Found
              </h4>
              <p className="text-gray-500">
                This customer doesn't have any MIP schemes yet.
              </p>

              <Link
                to={`/create-mip/${customer._id}/${customer.savingAccountNumber}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mt-4"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New MIP
              </Link>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default CustomerDetails;