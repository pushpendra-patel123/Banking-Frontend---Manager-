import React, { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaTimes, FaExclamationTriangle, FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaToggleOn, FaUsers, FaHeart, FaBirthdayCake, FaPiggyBank, FaChartLine, FaIdCard, FaCreditCard, FaPen, FaCheck, FaVenus } from "react-icons/fa";
// import api from "../../api/api"; 
import axios from "axios";
// import { apiAgentUrl } from "../../api/apiRoutes";

function ViewAgent() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [agent, setAgent] = useState(null);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 0,
    });

    const [search, setSearch] = useState("");
    const token = sessionStorage.getItem("token");
    const fetchCustomers = async () => {
        // setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_URL}/agent/getCoustomer/${id}?page=${page}&limit=${limit}`;
            const params = [];

            if (search.trim())
                params.push(`search=${encodeURIComponent(search.trim())}`);
            //   if (selectedManager) params.push(`managerId=${selectedManager}`);
            //   if (selectedAgent) params.push(`agentId=${selectedAgent}`);
            //   if (startDate) params.push(`fromDate=${startDate}`);
            //   if (endDate) params.push(`toDate=${endDate}`);

            if (params.length > 0) url += `&${params.join("&")}`;

            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`

                },
            });
            setCustomers(res.data?.data || []);
            const Pagination = {
                total: res.data.total,
                page: res.data.page,
                pages: res.data.totalPages
            }
            setPagination(Pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            // setLoading(false);
        }
    };

    const fetchAgent = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/agent/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`

                },
            });
            setAgent(res.data.data || res.data); // ✅ backend ke response ke hisaab se
        } catch (error) {
            console.error("Error fetching agent data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgent();
        fetchCustomers();
    }, [id])


    useEffect(() => {

        fetchCustomers();


    }, [page, limit]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading customers...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }


    if (!agent) {
        return <p className="text-center text-red-500">Agent not found ❌</p>;
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
                {/* Header */}
                <div className="bg-gradient-to-br rounded-md from-orange-500 via-red-500 to-red-600 shadow-md px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-black p-2 hover:bg-orange-100 rounded-full transition-colors"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Agent Details</h1>
                </div>


                <div className=" mx-auto p-6">
                    {/* Customer Info Card */}
                    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8 px-4">
                        <div className="max-w-6xl mx-auto">
                            {/* Customer Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

                                {/* Header */}
                                <div className="flex items-center mb-6">
                                    <div className="bg-orange-100 p-3 rounded-full mr-4 flex items-center justify-center">
                                        <FaUser className="text-orange-600 text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Agent Information
                                    </h2>
                                </div>

                                {/* Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Name */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                                            <FaUser className="text-orange-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">Name</span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.name || "N/A"}
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
                                                {agent?.email || "N/A"}
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
                                                {agent?.contact || "N/A"}
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
                                                {agent?.address || "N/A"}
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
                                                {agent?.gender || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Manager */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                                            <FaUserTie className="text-orange-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">Manager</span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.managerId?.name || "Not Assigned"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Area Manager */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3 shrink-0">
                                            <FaUserTie className="text-orange-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">Area Manager</span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.areaManagerId?.name || "Not Assigned"}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Account & Document Information */}
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

                                {/* Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Aadhaar */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                                            <FaIdCard className="text-blue-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">
                                                Aadhaar Number
                                            </span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.AadharNo || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* PAN */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                                            <FaCreditCard className="text-blue-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">
                                                PAN Card
                                            </span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.panCard || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Signature */}
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3 shrink-0">
                                            <FaPen className="text-blue-500 text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-600">
                                                Signature
                                            </span>

                                            <div className="mt-2">
                                                {agent?.signature ? (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <FaCheck className="text-green-500" />
                                                        <span className="text-green-600 font-medium">
                                                            Uploaded
                                                        </span>
                                                        <a
                                                            href={agent?.signature}
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
                                                        <span className="text-red-600 font-medium">
                                                            Not Uploaded
                                                        </span>
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
                                            <span className="text-sm font-medium text-gray-600">
                                                Registration Date
                                            </span>
                                            <p className="text-gray-800 font-semibold">
                                                {agent?.createdAt
                                                    ? new Date(agent.createdAt).toLocaleDateString("en-IN", {
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
                                            <span className="text-sm font-medium text-gray-600">
                                                Account Status
                                            </span>
                                            <div className="mt-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${agent?.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {agent?.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Nominee Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">

                                {/* Header */}
                                <div className="flex items-center mb-6">
                                    <div className="bg-green-100 p-3 rounded-full mr-4 flex items-center justify-center">
                                        <FaUsers className="text-green-600 text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Nominee Information
                                    </h2>
                                </div>

                                {agent?.NomineeDetails ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                        {/* Nominee Name */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaUser className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Nominee Name</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.name || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Relation */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaHeart className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Relation</span>
                                                <p className="text-gray-800 font-semibold capitalize">
                                                    {agent.NomineeDetails.relation || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaBirthdayCake className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Age</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.age || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* DOB */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaCalendarAlt className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Date of Birth</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.dob
                                                        ? new Date(agent.NomineeDetails.dob).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaEnvelope className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Email</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.email || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Mobile */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaPhone className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Mobile Number</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.mobile || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Aadhaar */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaIdCard className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Aadhaar Number</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.AadharNo || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* PAN */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaCreditCard className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">PAN Card</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.panCard || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start p-4 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-1 hover:shadow-md transition">
                                            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-3 shrink-0">
                                                <FaMapMarkerAlt className="text-green-500 text-lg" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-600">Address</span>
                                                <p className="text-gray-800 font-semibold">
                                                    {agent.NomineeDetails.address || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">
                                            No nominee information available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">

                {/* Table */}
                <div className="bg-white rounded shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border">Serial No.</th>
                                <th className="px-4 py-2 border">Customer Name</th>
                                <th className="px-4 py-2 border">Email Address</th>
                                <th className="px-4 py-2 border">Contact No.</th>
                                <th className="px-4 py-2 border">Address</th>
                                <th className="px-4 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(customers) && customers.length > 0 ? (
                                customers.map((cust, idx) => (
                                    <tr key={cust._id} className="odd:bg-white even:bg-yellow-50">
                                        <td className="px-4 py-2 border">
                                            {String((page - 1) * limit + idx + 1).padStart(2, "0")}
                                        </td>
                                        <td className="px-4 py-2 border">{cust.name}</td>
                                        <td className="px-4 py-2 border">
                                            <a
                                                href={`mailto:${cust.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {cust.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <a
                                                href={`tel:${cust.contact?.replace(/\s/g, "")}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {cust.contact}
                                            </a>
                                        </td>
                                        <td className="px-4 py-2 border">{cust.address}</td>
                                        <td className="px-4 py-2 border">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/customers/view/${cust._id}`}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                                                    title="View"
                                                >
                                                    <FaEye size={14} />
                                                </Link>
                                                {/* <Link
                                                to={`/coustomers/View-Edit/${cust._id}`}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                                                title="Edit"
                                            >
                                                <FaPen size={14} />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(cust._id)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                                                title="Delete"
                                            >
                                                <FaTrash size={14} />
                                            </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span>
                        Page {pagination.page} of {pagination.pages}
                    </span>

                    <button
                        disabled={page === pagination.pages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Page Size Dropdown */}
                <div className="mt-3">
                    <label className="mr-2">Rows per page:</label>
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded px-2 py-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

            </div>
        </>
    );
}

export default ViewAgent;
