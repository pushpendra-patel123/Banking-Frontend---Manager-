import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaBan, FaEye, FaPen, FaTrash, FaUnlock, FaChevronDown, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

import DeletePopup from "../modal/DeletePopup";

export default function Agent() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // search + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const token = sessionStorage.getItem("token");
  const [areaManagerId, setAreaManagerId] = useState("");
  const manager = JSON.parse(sessionStorage.getItem("user"));

  // Area Manager dropdown search functionality
  const [areaManagers, setAreaManagers] = useState([]);
  const [filteredAreaManagers, setFilteredAreaManagers] = useState([]);
  const [areaManagerSearch, setAreaManagerSearch] = useState("");
  const [selectedAreaManager, setSelectedAreaManager] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/manager/agents/${manager._id}`,
        {
          params: { search, page, limit, areaManagerId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data) {
        setData(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const managerId = JSON.parse(sessionStorage.getItem("user"))._id;
  const fetchAreaManagers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/areaManager?managerId=${managerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const managers = res.data.data || [];
      setAreaManagers(managers);
      setFilteredAreaManagers(managers);
    } catch (error) {
      console.error("Error fetching area managers:", error);
    }
  };

  // Handle area manager search
  const handleAreaManagerSearch = (searchTerm) => {
    setAreaManagerSearch(searchTerm);
    const filtered = areaManagers.filter(manager =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAreaManagers(filtered);
  };

  // Handle area manager selection
  const handleAreaManagerSelect = (manager) => {
    setSelectedAreaManager(manager);
    setAreaManagerId(manager._id);
    setAreaManagerSearch(manager.name);
    setIsDropdownOpen(false);
    setPage(1);
  };

  // Clear area manager selection
  const clearAreaManagerSelection = () => {
    setSelectedAreaManager(null);
    setAreaManagerId("");
    setAreaManagerSearch("");
    setFilteredAreaManagers(areaManagers);
    setPage(1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchAreaManagers();
  }, [search, page, limit, areaManagerId]);

  // delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/agent/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      alert("Agent deleted successfully ✅");

      setData((prev) => prev.filter((item) => item._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete agent ❌");
    }
  };

  if (error) {
    return (
      <p className="text-center text-red-500">
        Error fetching data: {error.message}
      </p>
    );
  }

  const handelBlock = async (agentId) => {
    try {
      const confirmBlock = window.confirm("Are you sure you want to block this agent?");
      if (!confirmBlock) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/manager/agent/block/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
      );

      if (res.data.success) {
        fetchData();
        alert("Agent blocked successfully");
      } else {
        alert(res.data.message || "Failed to block agent");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while blocking agent");
    }
  };

  const handelUnBlock = async (agentId) => {
    try {
      const confirmUnblock = window.confirm("Are you sure you want to unblock this agent?");
      if (!confirmUnblock) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/manager/agent/unblock/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
      );

      if (res.data.success) {
        fetchData();
        alert("Agent unblocked successfully");
      } else {
        alert(res.data.message || "Failed to unblock agent");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while unblocking agent");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between p-2 rounded-md bg-gradient-to-br from-orange-500 via-red-500 to-red-600 items-center mb-4">
        <h2 className="text-xl font-bold">Agent Management</h2>
        <Link
          to="/add-agent"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Add Agent
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search agent by Name & Mobile"
          className="border border-gray-400 px-3 py-1 rounded w-64"
        />

        {/* Custom Searchable Dropdown for Area Manager */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              value={areaManagerSearch}
              onChange={(e) => {
                handleAreaManagerSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search Area Manager By Name & Mobile"
              className="border border-gray-400 px-3 py-2 pr-8 rounded w-64 focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaChevronDown
                className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                  }`}
                size={12}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {/* Clear option */}
              <div
                onClick={clearAreaManagerSelection}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 text-gray-600"
              >
                <span className="font-medium">All Area Managers</span>
              </div>

              {/* Area Manager Options */}
              {filteredAreaManagers.length > 0 ? (
                filteredAreaManagers.map((manager) => (
                  <div
                    key={manager._id}
                    onClick={() => handleAreaManagerSelect(manager)}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${selectedAreaManager?._id === manager._id ? 'bg-blue-100' : ''
                      }`}
                  >
                    <div className="font-medium">{manager.name}</div>
                    {manager.email && (
                      <div className="text-sm text-gray-600">{manager.email}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No area managers found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clear selection button */}
        {selectedAreaManager && (
          <button
            onClick={clearAreaManagerSelection}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Sr.</th>
              <th className="px-4 py-2 border">Agent Name</th>
              <th className="px-4 py-2 border">Email Address</th>
              <th className="px-4 py-2 border">Contact No.</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((cust, idx) => (
                <tr key={cust._id} className="odd:bg-white even:bg-yellow-50">
                  <td className="px-4 py-2 border">
                    {String((page - 1) * limit + idx + 1)}
                  </td>
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.email}</td>
                  <td className="px-4 py-2 border">{cust.contact}</td>
                  <td className="px-4 py-2 border">{cust.address}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      <Link
                        title="view Agent"
                        to={`/agent/view/${cust._id}`}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                      >
                        <FaEye size={14} />
                      </Link>
                      <Link
                        title="edit Agent"
                        to={`/agent/View-Edit/${cust._id}`}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                      >
                        <FaPen size={14} />
                      </Link>
                      <button
                        title="Delete Agent"
                        onClick={() => {
                          setDeleteId(cust._id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                      >
                        <FaTrash size={14} />
                      </button>
                      {cust.isActive ? (
                        <button
                          onClick={() => handelBlock(cust._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Block Agent"
                        >
                          <FaBan size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handelUnBlock(cust._id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                          title="Unblock Agent"
                        >
                          <FaUnlock size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No agents found
                </td>
              </tr>
            )}
            {loading && <p className="text-center text-gray-500">Loading data...</p>}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 border rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages} ({totalItems} agents)
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 border rounded ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Next
        </button>
      </div>

      {/* Delete Popup */}
      <DeletePopup
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        user="Agent"
      />
    </div>
  );
}