import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaTimes, FaMapMarkerAlt, FaExclamationTriangle, FaUserTie, FaCalendarAlt, FaToggleOn, FaUsers, FaHeart, FaBirthdayCake, FaPiggyBank, FaChartLine, FaIdCard, FaCreditCard, FaPen, FaCheck, FaVenus } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FDDepositModal from "./FDDepositModal";
import RDEmiPayModal from "./RDEmiPayModal";
import LoanEmiPayModal from "./LoanEmiPayModal";
import PigmyEmiPayModal from "./PigmyEmiPayModal";
function ViewCoustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token")
  // ✅ Fetch customer details
  useEffect(() => {
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
    fetchDetails();
  }, [id]);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 p-2 hover:bg-orange-100 rounded-full transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Customer Info Card */}
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-1 rounded-full mr-4 w-20 h-20 flex items-center justify-center overflow-hidden">
                  <img
                    src={customer?.picture ||
                      "./ProfileImage.png"
                    }
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
                      {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN') : "N/A"}
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
                              ₹{fd.fdPrincipalAmount ? fd.fdPrincipalAmount.toLocaleString() : "0"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Deposit Amount</span>
                            <p className="text-lg font-semibold text-gray-800">
                              ₹{fd.fdDepositAmount ? fd.fdDepositAmount.toLocaleString() : "0"}
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
                              {fd.fdOpeningDate ? new Date(fd.fdOpeningDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                            <p className="text-lg font-semibold text-gray-800">
                              {fd.fdMaturityDate ? new Date(fd.fdMaturityDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                            <p className="text-xl font-bold text-green-600">
                              ₹{fd.fdMaturityAmount ? fd.fdMaturityAmount.toLocaleString() : "0"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Status</span>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${fd.fdAccountStatus === "Active"
                                ? "bg-green-200 text-green-800"
                                : fd.fdAccountStatus === "Matured"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-red-200 text-red-800"
                                }`}
                            >
                              {fd.fdAccountStatus || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {fd.fdDepositAmount == 0 &&
                        <div className="mt-6 flex justify-left text-left">
                          <FDDepositModal fd={fd} customerId={customer._id} />
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
                    to={`/create-fd/${customer.CustomerId}`}
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
              <div>
                <Link
                  to={`/coustomers/paymentdetails/${id}/RD`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
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
                        <p className="text-xl font-bold text-purple-600">₹{rd.rdInstallAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Installments</span>
                        <p className="text-lg font-semibold text-gray-800">{rd.rdTotalInstallments || 0}</p>
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
                          {rd.rdOpeningDate ? new Date(rd.rdOpeningDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdMaturityDate ? new Date(rd.rdMaturityDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Total DepositedtAmount</span>
                        <p className="text-lg font-bold text-blue-600">{rd.rdTotalDepositedtAmount || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Total DepositedInstallment</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdTotalDepositedInstallment || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">RD Tenure Type</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {rd.rdTenureType || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-xl font-bold text-purple-600">₹{rd.rdMaturityAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${rd.rdAccountStatus === 'Active'
                          ? 'bg-green-200 text-green-800'
                          : rd.rdAccountStatus === 'Matured'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-red-200 text-red-800'
                          }`}>
                          {rd.rdAccountStatus}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="mt-6 flex justify-left text-left">

                    <RDEmiPayModal rd={rd} customerId={customer._id} />
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
                  to={`/create-rd/${customer.CustomerId}`}
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
              <div>
                <Link
                  to={`/coustomers/paymentdetails/${id}/LOAN`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
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
                        <p className="text-xl font-bold text-purple-600">₹{loan.loanPrincipalAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Emi Amount</span>
                        <p className="text-lg font-semibold text-gray-800">₹{loan.loanEMIAmount}</p>
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
                          ₹{loan.loanOutstandingAmount || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Loan Time period</span>
                        <p className="text-xl font-bold text-purple-600">{loan.loanTenure}-{loan.loanTenureType}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total Emi Paid</span>
                        <p className="text-lg font-bold text-blue-600">₹{loan.loanTotalEmiDeposited}</p>
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
              <p className="text-gray-500">This customer doesn't have any RD schemes yet.</p>

              <div className="mt-6">
                <Link
                  to={`/create-loan/${customer.CustomerId}`}
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
              <div>
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
                        <p className="text-lg font-semibold text-gray-800">₹{pigmy.pigmyDailyDeposit}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Amount</span>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{pigmy.pigMyMaturityAmount || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Interest Rate</span>
                        <p className="text-lg font-bold text-blue-600">{pigmy.pigMyInterestRate}% p.a.</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Opening Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {pigmy.pigMyOpeningDate ? new Date(pigmy.pigMyOpeningDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Maturity Date</span>
                        <p className="text-lg font-semibold text-gray-800">
                          {pigmy.pigMyMaturityDate ? new Date(pigmy.pigMyMaturityDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>


                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600"> Total Installment Paid</span>
                        <p className="text-lg font-bold text-blue-600">₹{pigmy.pigMyTotalDepositedAmount}</p>
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
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${pigmy.pigMyAccountStatus === 'active'
                          ? 'bg-green-200 text-green-800'
                          : pigmy.pigMyAccountStatus === 'matured'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-red-200 text-red-800'
                          }`}>
                          {pigmy.pigMyAccountStatus}
                        </span>
                      </div>

                    </div>

                    <div className="space-y-3">


                    </div>
                  </div>

                  <div className="mt-6 flex justify-left text-left">
                    <PigmyEmiPayModal pigmy={pigmy} customerId={customer._id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No PIGMY Deposit Schemes Found</h4>
              <p className="text-gray-500">This customer doesn't have any RD schemes yet.</p>

              <Link
                to={`/create-pigmy/${customer.CustomerId}`}
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

      </div>
    </div>
  );
}

export default ViewCoustomer;