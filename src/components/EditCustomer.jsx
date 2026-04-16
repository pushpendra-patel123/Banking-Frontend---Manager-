import { FaArrowLeft, FaEye, FaEyeSlash, FaCamera, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

/* ─── helpers ─────────────────────────────────────────────── */
const calcAgeFromDob = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
  const [previewSignature, setPreviewSignature] = useState(null);
  const [newSignatureFile, setNewSignatureFile] = useState(null);
  const [backendError, setBackendError] = useState("");

  const token = sessionStorage.getItem("token");
  const managerId = JSON.parse(sessionStorage.getItem("user"))._id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  /* fetch customer */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/customer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || res.data;
        setCustomer(data);
        setProfilePreview(data.picture || null);
        setPreviewSignature(data.signature || null);

        reset({
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          address: data.address || "",
          agentId: data.agentId?._id || "",
          gender: data.gender || "",
          AadharNo: data.AadharNo || "",
          panCard: data.panCard || "",
          savingAccountNumber: data.savingAccountNumber || "",
          NomineeDetails: {
            name: data.NomineeDetails?.name || "",
            relation: data.NomineeDetails?.relation || "",
            age: data.NomineeDetails?.age || "",
            dob: data.NomineeDetails?.dob ? data.NomineeDetails.dob.slice(0, 10) : "",
            email: data.NomineeDetails?.email || "",
            mobile: data.NomineeDetails?.mobile || "",
            AadharNo: data.NomineeDetails?.AadharNo || "",
            panCard: data.NomineeDetails?.panCard || "",
            address: data.NomineeDetails?.address || "",
          },
        });
      } catch (err) {
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCustomer();
  }, [id, reset, token]);

  /* fetch agents */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/agent?managerId=${managerId}&all=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgents(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, [token]);

  /* auto-fill age from DOB */
  const nomineeDob = watch("NomineeDetails.dob");
  useEffect(() => {
    if (nomineeDob) {
      const age = calcAgeFromDob(nomineeDob);
      if (age !== null && age >= 0 && age <= 120) {
        setValue("NomineeDetails.age", age, { shouldValidate: true });
        clearErrors("NomineeDetails.age");
      } else if (age !== null) {
        setValue("NomineeDetails.age", "");
        setError("NomineeDetails.age", { type: "manual", message: "DOB implies an invalid age" });
      }
    }
  }, [nomineeDob]);

  /* profile picture handler */
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("profilePicture", { type: "manual", message: "Only JPG and PNG files are allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("profilePicture", { type: "manual", message: "File size must be under 5 MB" });
      return;
    }
    clearErrors("profilePicture");
    setNewProfilePictureFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePreview(null);
    setNewProfilePictureFile(null);
    clearErrors("profilePicture");
    const fileInput = document.getElementById("profilePictureInput");
    if (fileInput) fileInput.value = "";
  };

  /* signature handler */
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewSignatureFile(file);
    if (file.type === "application/pdf") {
      setPreviewSignature("pdf");
    } else {
      setPreviewSignature(URL.createObjectURL(file));
    }
  };

  /* submit */
  const onSubmit = async (data) => {
    setSaving(true);
    setBackendError("");
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "NomineeDetails") {
          Object.entries(value).forEach(([nkey, nvalue]) =>
            formData.append(`NomineeDetails[${nkey}]`, nvalue)
          );
        } else if (key !== "profilePicture" && key !== "signature") {
          formData.append(key, value ?? "");
        }
      });
      if (newProfilePictureFile) formData.append("picture", newProfilePictureFile);
      if (newSignatureFile) formData.append("signature", newSignatureFile);

      await axios.put(`${import.meta.env.VITE_API_URL}/customer/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Customer updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating customer:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      /* map field-level backend errors */
      const fieldMap = {
        email: "email", contact: "contact", AadharNo: "AadharNo",
        panCard: "panCard", name: "name", savingAccountNumber: "savingAccountNumber",
      };
      let handled = false;
      if (serverMsg) {
        Object.entries(fieldMap).forEach(([key, field]) => {
          if (serverMsg.toLowerCase().includes(key.toLowerCase())) {
            setError(field, { type: "server", message: serverMsg });
            handled = true;
          }
        });
      }
      if (!handled) setBackendError(serverMsg || "Failed to update customer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ─── field class helper ─────────────────────────────────── */
  const fieldClass = (hasError) =>
    `w-full p-3 border ${hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-200 focus:border-yellow-400 bg-gray-50"
    } rounded-lg outline-none transition-colors duration-200`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto mb-3" />
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white p-4">
      <div className="w-full mx-auto shadow-lg rounded-xl bg-white">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="Back"
            >
              <FaArrowLeft className="text-white text-sm" />
            </button>
            <h2 className="text-xl font-semibold text-white">Edit Customer</h2>
          </div>
          <button
            type="submit"
            form="editForm"
            disabled={isSubmitting || saving}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-sm active:scale-95 transition-all"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* global backend error */}
        {backendError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            ⚠️ {backendError}
          </div>
        )}

        <form
          id="editForm"
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-8"
          encType="multipart/form-data"
        >

          {/* ── Profile Picture ──────────────────────────────── */}
          <section className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-gray-700">Profile Picture</h3>

            <div className="relative">
              {profilePreview ? (
                <>
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-300 shadow-lg"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/128?text=Customer"; }}
                  />
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                    title="Remove"
                  >
                    <FaTimes size={11} />
                  </button>
                </>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-yellow-200 flex items-center justify-center shadow-lg">
                  <FaCamera className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>

            <div className="w-full max-w-sm space-y-1">
              <input
                id="profilePictureInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleProfilePictureChange}
                className={fieldClass(!!errors.profilePicture)}
              />
              {errors.profilePicture && (
                <p className="text-red-500 text-xs">{errors.profilePicture.message}</p>
              )}
              <p className="text-xs text-gray-400">Optional · JPG or PNG · max 5 MB</p>
            </div>
          </section>

          {/* ── Customer Fields ──────────────────────────────── */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field label="Name" required error={errors.name}>
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
                      value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                      message: "Only letters allowed, spaces only between words",
                    },
                    validate: (value) =>
                      value.trim().length > 0 || "Name cannot be empty or just spaces",
                  })}
                  placeholder="Enter Name"
                  className={fieldClass(!!errors.name)}
                />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Enter Email"
                  className={fieldClass(!!errors.email)}
                />
              </Field>

              <Field label="Contact" required error={errors.contact}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("contact", {
                    required: "Contact is required",
                    pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian mobile number" },
                  })}
                  placeholder="Enter Contact"
                  className={fieldClass(!!errors.contact)}
                />
              </Field>

              <Field label="Address" required error={errors.address}>
                <input
                  type="text"
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 10, message: "Address must be at least 10 characters" },
                  })}
                  placeholder="Enter Address"
                  className={fieldClass(!!errors.address)}
                />
              </Field>

              <Field label="Gender" required error={errors.gender}>
                <select
                  {...register("gender", { required: "Please select a gender" })}
                  className={fieldClass(!!errors.gender)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Agent" required error={errors.agentId}>
                <select
                  {...register("agentId", { required: "Please select an agent" })}
                  className={fieldClass(!!errors.agentId)}
                >
                  <option value="">Select Agent</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Aadhaar Number" required error={errors.AadharNo}>
                <input
                  type="text"
                  maxLength={12}
                  {...register("AadharNo", {
                    required: "Aadhaar number is required",
                    minLength: { value: 12, message: "Must be exactly 12 digits" },
                    maxLength: { value: 12, message: "Must be exactly 12 digits" },
                    pattern: { value: /^\d{12}$/, message: "Must be exactly 12 digits" },
                  })}
                  placeholder="Enter Aadhaar Number"
                  className={fieldClass(!!errors.AadharNo)}
                />
              </Field>

              <Field label="PAN Card" required error={errors.panCard}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("panCard", {
                    required: "PAN card is required",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Format: ABCDE1234F",
                    },
                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                  })}
                  placeholder="Enter PAN Card"
                  className={`${fieldClass(!!errors.panCard)} uppercase`}
                />
              </Field>

              <Field label="Saving AC Number" required error={errors.savingAccountNumber}>
                <input
                  type="text"
                  maxLength={20}
                  {...register("savingAccountNumber", {
                    required: "Account number is required",
                    pattern: { value: /^\d+$/, message: "Only digits allowed" },
                  })}
                  placeholder="Enter Saving Account Number"
                  className={fieldClass(!!errors.savingAccountNumber)}
                />
              </Field>

              {/* New Password */}
              <Field label="New Password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    placeholder="Leave blank to keep current password"
                    className={`${fieldClass(!!errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Field>

              {/* Signature */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">Signature</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleSignatureChange}
                  className={fieldClass(false)}
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF · max 2 MB</p>

                {/* Signature preview */}
                <div className="mt-3">
                  {previewSignature && previewSignature !== "pdf" ? (
                    <img
                      src={previewSignature}
                      alt="Signature"
                      className="h-24 border border-gray-200 rounded-lg object-contain bg-gray-50"
                    />
                  ) : previewSignature === "pdf" ? (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      📄 PDF signature selected
                    </div>
                  ) : customer?.signature ? (
                    customer.signature.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                        📄 Existing PDF signature on file
                      </div>
                    ) : (
                      <img
                        src={customer.signature}
                        alt="Current Signature"
                        className="h-24 border border-gray-200 rounded-lg object-contain bg-gray-50"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    )
                  ) : null}
                </div>
              </div>

            </div>
          </section>

          {/* ── Nominee Details ──────────────────────────────── */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-700 mb-4">Nominee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field label="Nominee Name" required error={errors?.NomineeDetails?.name}>
                <input
                  type="text"
                  {...register("NomineeDetails.name", {
                    required: "Nominee name is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Cannot exceed 50 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                      message: "Only letters allowed, spaces only between words",
                    },
                    validate: (value) =>
                      value.trim().length > 0 || "Name cannot be empty or just spaces",
                  })}
                  placeholder="Enter Nominee Name"
                  className={fieldClass(!!errors?.NomineeDetails?.name)}
                />
              </Field>

              <Field label="Relation" required error={errors?.NomineeDetails?.relation}>
                <input
                  type="text"
                  {...register("NomineeDetails.relation", { required: "Relation is required" })}
                  placeholder="e.g. Spouse, Son, Daughter"
                  className={fieldClass(!!errors?.NomineeDetails?.relation)}
                />
              </Field>

              {/* DOB — drives Age */}
              <Field label="Date of Birth" required error={errors?.NomineeDetails?.dob}>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("NomineeDetails.dob", {
                    required: "Date of birth is required",
                    validate: {
                      notFuture: (v) =>
                        new Date(v) <= new Date() || "Date of birth cannot be in the future",
                    },
                  })}
                  className={fieldClass(!!errors?.NomineeDetails?.dob)}
                />
              </Field>

              {/* Age — auto-filled from DOB */}
              <Field label="Age" required error={errors?.NomineeDetails?.age}>
                <input
                  type="number"
                  min="0"
                  max="120"
                  {...register("NomineeDetails.age", {
                    required: "Age is required",
                    min: { value: 0, message: "Age cannot be negative" },
                    max: { value: 120, message: "Age cannot exceed 120" },
                    valueAsNumber: true,
                    validate: {
                      matchesDob: (val) => {
                        const dob = watch("NomineeDetails.dob");
                        if (!dob) return true;
                        const expected = calcAgeFromDob(dob);
                        return (
                          expected === null ||
                          Math.abs(val - expected) <= 1 ||
                          `Age doesn't match DOB (expected ~${expected})`
                        );
                      },
                    },
                  })}
                  placeholder="Auto-filled from DOB"
                  className={fieldClass(!!errors?.NomineeDetails?.age)}
                />
              </Field>

              <Field label="Nominee Email" required error={errors?.NomineeDetails?.email}>
                <input
                  type="email"
                  {...register("NomineeDetails.email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Nominee Email"
                  className={fieldClass(!!errors?.NomineeDetails?.email)}
                />
              </Field>

              <Field label="Mobile Number" required error={errors?.NomineeDetails?.mobile}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.mobile", {
                    required: "Mobile number is required",
                    pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian number" },
                  })}
                  placeholder="Mobile Number"
                  className={fieldClass(!!errors?.NomineeDetails?.mobile)}
                />
              </Field>

              <Field label="Nominee Aadhaar" required error={errors?.NomineeDetails?.AadharNo}>
                <input
                  type="text"
                  maxLength={12}
                  {...register("NomineeDetails.AadharNo", {
                    required: "Nominee Aadhaar is required",
                    pattern: { value: /^\d{12}$/, message: "Must be exactly 12 digits" },
                  })}
                  placeholder="Nominee Aadhaar Number"
                  className={fieldClass(!!errors?.NomineeDetails?.AadharNo)}
                />
              </Field>

              <Field label="Nominee PAN" error={errors?.NomineeDetails?.panCard}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.panCard", {
                    pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Format: ABCDE1234F" },
                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                  })}
                  placeholder="Nominee PAN (Optional)"
                  className={`${fieldClass(!!errors?.NomineeDetails?.panCard)} uppercase`}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Nominee Address" required error={errors?.NomineeDetails?.address}>
                  <input
                    type="text"
                    {...register("NomineeDetails.address", {
                      required: "Nominee address is required",
                      minLength: { value: 10, message: "Address must be at least 10 characters" },
                    })}
                    placeholder="Nominee Address"
                    className={fieldClass(!!errors?.NomineeDetails?.address)}
                  />
                </Field>
              </div>

            </div>
          </section>

        </form>
      </div>
    </div>
  );
};

/* ─── Reusable field wrapper ─────────────────────────────── */
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block font-semibold text-sm mb-1 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default EditCustomer;