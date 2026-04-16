import React, { useState } from "react";
import { X, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

const MipMaturityModal = ({ customer, mipScheme }) => {
  const token = sessionStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    savingAccountNumber: customer?.savingAccountNumber,
    mipAccountNumber: mipScheme.mipAccountNumber,
  });
  const [maturityData, setMaturityData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Calculate MIP Maturity
  const handleCalculate = () => {
    setLoading(true);

    const scheme = customer.mipSchemes?.find(
      (s) => s.mipAccountNumber === formData.mipAccountNumber
    );

    if (!scheme) {
      alert("MIP scheme not found for this customer");
      setLoading(false);
      return;
    }

    const now = new Date();

    // Maturity calculation: simple interest for MIP
    const tenureMonths = scheme.mipTenureType === "year" ? scheme.mipTenure * 12 : scheme.mipTenure;
    const principalDeposited = scheme.mipDepositAmount;
    // const interestRate = scheme.mipInterestRate;

    // const interestEarned = (principalDeposited * interestRate * (tenureMonths / 12)) / 100;
    const netPayable = principalDeposited;

    setMaturityData({
      principalDeposited,
      //   interestEarned,
      netPayable,
      maturityDate: scheme.mipMaturityDate,
      canWithdraw: new Date(scheme.mipMaturityDate) <= now,
      tenureMonths,
      //   isPremature: new Date() < new Date(scheme.mipMaturityDate),
      //   penalty: new Date() < new Date(scheme.mipMaturityDate) ? interestEarned * 0.5 : 0, // example: 50% interest reduction for premature
    });

    setLoading(false);
  };

  const handleProceedToConfirmation = () => {
    if (!maturityData || !maturityData.canWithdraw) return;
    setShowConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    if (!formData.savingAccountNumber || !formData.mipAccountNumber) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transactionSchemes/transaction/MIP/maturityPay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId: customer._id,
            mipAccountNumber: formData.mipAccountNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error processing MIP payout");
      } else {
        alert(data.message || "MIP payout processed successfully!");
        handleClose();
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Server error occurred while processing payout");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowConfirmation(false);
    setMaturityData(null);
  };

  return (
    <div>
      {/* Trigger Button */}
      <div className=" flex justify-left text-left">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 mt-3 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          MIP Maturity
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">MIP Maturity / Premature Closure</h2>
                  <p className="text-purple-100 text-sm">Process MIP closure</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!showConfirmation ? (
                <>
                  {/* Input Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Saving Account</label>
                      <input
                        type="text"
                        disabled
                        value={formData.savingAccountNumber}
                        className="w-full px-4 py-3 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">MIP Account</label>
                      <input
                        type="text"
                        disabled
                        value={formData.mipAccountNumber}
                        className="w-full px-4 py-3 border rounded-xl"
                      />
                    </div>
                    <button
                      onClick={handleCalculate}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
                    >
                      {loading ? "Calculating..." : "Calculate Maturity Amount"}
                    </button>
                  </div>

                  {/* Maturity Details */}
                  {maturityData && (
                    <div className="mt-6 space-y-4">
                      {maturityData.isPremature && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <p className="text-sm text-yellow-700">
                            Premature closure detected. Reduced interest applied.
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                        <div className="flex justify-between"><span>Principal Amount</span><span>₹{maturityData.principalDeposited.toLocaleString()}</span></div>
                        {/* <div className="flex justify-between"><span>Interest Earned</span><span>₹{maturityData.interestEarned.toLocaleString()}</span></div> */}
                        {/* {maturityData.penalty > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Penalty</span><span>-₹{maturityData.penalty.toLocaleString()}</span>
                          </div>
                        )} */}
                        <div className="flex justify-between text-lg mt-2">
                          <span>Maturity Amount</span><span>₹{maturityData.netPayable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg mt-2">
                          <span>Maturity Date</span><span>{new Date(maturityData.maturityDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleProceedToConfirmation}
                        disabled={!maturityData.canWithdraw}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold mt-4 transition-colors 
    ${maturityData.canWithdraw
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Proceed to Confirmation</span>
                      </button>

                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <h3 className="text-2xl font-bold">Confirm MIP Closure</h3>
                  <p className="text-gray-600">Are you sure you want to process this closure?</p>
                  <div className="bg-gray-50 rounded-xl p-6 border mt-4">
                    <div className="flex justify-between"><span>Saving Ac:</span><span>{formData.savingAccountNumber}</span></div>
                    <div className="flex justify-between"><span>MIP Account:</span><span>{formData.mipAccountNumber}</span></div>
                    <div className="flex justify-between font-bold text-green-600 mt-3"><span>Amount to be Paid:</span><span>₹{maturityData.netPayable.toLocaleString()}</span></div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => setShowConfirmation(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Go Back</button>
                    <button onClick={handleFinalSubmit} className="flex-1 bg-purple-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Confirm & Process
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MipMaturityModal;
