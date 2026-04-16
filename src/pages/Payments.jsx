import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { FaEye, FaChevronDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAreaManager, setSelectedAreaManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedSchemeType, setSelectedSchemeType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const manager = JSON.parse(sessionStorage.getItem("user"));
  const [agents, setAgents] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [agentSearch, setAgentSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [areaManagerSearch, setAreaManagerSearch] = useState("");
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [areaManagerDropdownOpen, setAreaManagerDropdownOpen] = useState(false);

  const agentDropdownRef = useRef(null);
  const customerDropdownRef = useRef(null);
  const areaManagerDropdownRef = useRef(null);

  const statusOptions = ["pending", "approved", "rejected"];
  const transactionTypeOptions = ["deposit", "withdrawal", "emi", "maturityPayout", "penality"];
  const modeOptions = ["cash", "bankTransfer", "upi", "cheque", "card"];
  const schemeTypeOptions = ["FD", "RD", "LOAN", "PIGMY", "SAVING_ACCOUNT", "Lakhpati", "MIP"];

  const managerId = JSON.parse(sessionStorage.getItem("user"))._id;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchAreaManagers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/areaManager?managerId=${managerId}&all=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAreaManagers(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/customer?managerId=${managerId}&all=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { search: debouncedSearch, page, limit, managerId: manager._id };
      if (selectedAgent) params.agentId = selectedAgent;
      if (selectedCustomer) params.customerId = selectedCustomer;
      if (selectedAreaManager) params.areaManagerId = selectedAreaManager;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedTransactionType) params.transactionType = selectedTransactionType;
      if (selectedMode) params.mode = selectedMode;
      if (selectedSchemeType) params.schemeType = selectedSchemeType;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (dateFilter) params.filter = dateFilter;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/transactions`,
        { params, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setData(response.data.transactions || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch, page, limit, selectedAgent, selectedCustomer,
    selectedAreaManager, selectedStatus, selectedTransactionType,
    selectedMode, selectedSchemeType, fromDate, toDate, dateFilter, manager._id,
  ]);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/manager/agents/${manager._id}`,
        { params: { all: true }, headers: { Authorization: `Bearer ${token}` } }
      );
      setAgents(response.data?.data || []);
    } catch {
      setAgents([]);
    }
  }, [manager._id]);

  useEffect(() => {
    fetchAgents();
    fetchAreaManagers();
    fetchCustomers();
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target))
        setAgentDropdownOpen(false);
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target))
        setCustomerDropdownOpen(false);
      if (areaManagerDropdownRef.current && !areaManagerDropdownRef.current.contains(event.target))
        setAreaManagerDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetAllFilters = () => {
    setSelectedAgent(""); setSelectedCustomer(""); setSelectedAreaManager("");
    setSelectedStatus(""); setSelectedTransactionType(""); setSelectedMode("");
    setSelectedSchemeType(""); setFromDate(""); setToDate(""); setDateFilter("");
    setSearch(""); setAgentSearch(""); setCustomerSearch(""); setAreaManagerSearch("");
    setPage(1);
  };

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(agentSearch.toLowerCase()));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredAreaManagers = areaManagers.filter(m => m.name.toLowerCase().includes(areaManagerSearch.toLowerCase()));

  const getSelectedAgentName = () => agents.find(a => a._id === selectedAgent)?.name || "";
  const getSelectedCustomerName = () => customers.find(c => c._id === selectedCustomer)?.name || "";
  const getSelectedAreaManagerName = () => areaManagers.find(m => m._id === selectedAreaManager)?.name || "";

  const handleAccept = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this transaction?`)) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/transaction/approvedReject/${id}`,
        { status, managerId: manager._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(prev => prev.map(trx => trx._id === id ? { ...trx, status } : trx));
    } catch {
      alert("Failed to update transaction");
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${map[status?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  /* ── Reusable searchable dropdown ── */
  const SearchableDropdown = ({ dropdownRef, open, setOpen, label, selected, items, search, setSearch, onSelect, onClear }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 bg-white text-sm h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected || label}
        </span>
        <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder={`Search...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div
            className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            onClick={() => { onClear(); setOpen(false); setSearch(""); setPage(1); }}
          >
            <span className="text-gray-500">{label}</span>
            {!selected && <span className="text-orange-500 text-xs">✓</span>}
          </div>
          {items.map(item => (
            <div
              key={item._id}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              onClick={() => { onSelect(item._id); setOpen(false); setSearch(""); setPage(1); }}
            >
              <span>{item.name}</span>
              {selected === item._id && <span className="text-orange-500 text-xs">✓</span>}
            </div>
          ))}
          {items.length === 0 && search && (
            <div className="px-3 py-2 text-gray-400 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 px-5 py-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white tracking-wide">Payments</h2>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">

        {/* Filter header */}
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">Filters</h3>
          <button
            onClick={resetAllFilters}
            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>

        {/* Row 1 — Agent / Customer / Area Manager / Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchableDropdown
            dropdownRef={agentDropdownRef}
            open={agentDropdownOpen}
            setOpen={setAgentDropdownOpen}
            label="All Agents"
            selected={selectedAgent ? getSelectedAgentName() : ""}
            items={filteredAgents}
            search={agentSearch}
            setSearch={setAgentSearch}
            onSelect={setSelectedAgent}
            onClear={() => setSelectedAgent("")}
          />
          <SearchableDropdown
            dropdownRef={customerDropdownRef}
            open={customerDropdownOpen}
            setOpen={setCustomerDropdownOpen}
            label="All Customers"
            selected={selectedCustomer ? getSelectedCustomerName() : ""}
            items={filteredCustomers}
            search={customerSearch}
            setSearch={setCustomerSearch}
            onSelect={setSelectedCustomer}
            onClear={() => setSelectedCustomer("")}
          />
          <SearchableDropdown
            dropdownRef={areaManagerDropdownRef}
            open={areaManagerDropdownOpen}
            setOpen={setAreaManagerDropdownOpen}
            label="All Area Managers"
            selected={selectedAreaManager ? getSelectedAreaManagerName() : ""}
            items={filteredAreaManagers}
            search={areaManagerSearch}
            setSearch={setAreaManagerSearch}
            onSelect={setSelectedAreaManager}
            onClear={() => setSelectedAreaManager("")}
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Row 2 — Transaction Type / Mode / Scheme / Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedTransactionType}
            onChange={e => { setSelectedTransactionType(e.target.value); setPage(1); }}
          >
            <option value="">All Transaction Types</option>
            {transactionTypeOptions.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedMode}
            onChange={e => { setSelectedMode(e.target.value); setPage(1); }}
          >
            <option value="">All Modes</option>
            {modeOptions.map(m => (
              <option key={m} value={m}>{m.replace("_", " ").charAt(0).toUpperCase() + m.replace("_", " ").slice(1)}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedSchemeType}
            onChange={e => { setSelectedSchemeType(e.target.value); setPage(1); }}
          >
            <option value="">All Scheme Types</option>
            {schemeTypeOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ledger number"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Row 3 — From Date / To Date / Quick Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => { setFromDate(e.target.value); setPage(1); if (dateFilter) setDateFilter(""); }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">To date</label>
            <input
              type="date"
              value={toDate}
              onChange={e => { setToDate(e.target.value); setPage(1); if (dateFilter) setDateFilter(""); }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Quick date filters</label>
            <div className="flex gap-2 h-9 items-center">
              {["today", "yesterday"].map(d => (
                <button
                  key={d}
                  onClick={() => { setDateFilter(d); setFromDate(""); setToDate(""); }}
                  className={`px-4 py-1.5 rounded-md border text-xs font-medium transition-colors ${dateFilter === d
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-orange-50 hover:border-orange-300"
                    }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left" >
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Sr.", "Date", "Account Type", "Ledger No.", "Customer", "Amount", "Type", "Mode", "Action", "Status"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-gray-400 text-sm">Loading data...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-red-500 text-sm">Error: {error.message}</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-gray-400 text-sm">No transactions found.</td>
                </tr>
              ) : (
                data.map((trx, idx) => (
                  <tr key={trx._id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(trx.date).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3">{trx.schemeType}</td>
                    <td className="px-4 py-3 font-mono text-xs">{trx.accountNumber}</td>
                    <td className="px-4 py-3">{trx.customerId?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-right font-medium">{trx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 capitalize">{trx.transactionType || "N/A"}</td>
                    <td className="px-4 py-3 capitalize">{trx.mode?.replace("_", " ") || "N/A"}</td>
                    <td className="px-4 py-3">
                      {trx.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(trx._id, "approved")}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAccept(trx._id, "rejected")}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        statusBadge(trx.status)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {statusBadge(trx.status)}
                        <button
                          onClick={() => navigate(`/payments/view/${trx._id}`)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-colors"
                          title="View details"
                        >
                          <FaEye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex justify-between items-center py-1">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          &nbsp;·&nbsp; {totalItems} Payments
        </span>
        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}