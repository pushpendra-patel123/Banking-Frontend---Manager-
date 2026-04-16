import { FaArrowLeft, FaCamera, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

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

const AddCustomer = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const [agents, setAgents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [backendError, setBackendError] = useState("");

  const token = sessionStorage.getItem("token");
  const managerId = JSON.parse(sessionStorage.getItem("user"))._id;

  /* fetch agents */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/agent?managerId=${managerId}&all=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  /* profile picture preview */
  const profilePicture = watch("profilePicture");
  useEffect(() => {
    if (profilePicture && profilePicture[0] instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(profilePicture[0]);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  /* auto-fill age from DOB */
  const nomineeDob = watch("NomineeDetails.dob");
  useEffect(() => {
    if (nomineeDob) {
      const age = calcAgeFromDob(nomineeDob);
      if (age !== null && age > 0) {
        setValue("NomineeDetails.age", age, { shouldValidate: true });
        clearErrors("NomineeDetails.age");
      } else if (age !== null) {
        setValue("NomineeDetails.age", "");
        setError("NomineeDetails.age", { type: "manual", message: "DOB implies invalid age" });
      }
    }
  }, [nomineeDob]);

  const removeProfilePicture = () => {
    setProfilePreview(null);
    const fileInput = document.getElementById("profilePictureInput");
    if (fileInput) fileInput.value = "";
  };

  /* submit */
  const onSubmit = async (data) => {
    setBackendError("");
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "signature" && data.signature?.[0]) {
          formData.append("signature", data.signature[0]);
        } else if (key === "profilePicture" && data.profilePicture?.[0]) {
          formData.append("picture", data.profilePicture[0]);
        } else if (key === "NomineeDetails") {
          Object.keys(data.NomineeDetails).forEach((nkey) =>
            formData.append(`NomineeDetails[${nkey}]`, data.NomineeDetails[nkey])
          );
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201 || res.status === 200) {
        alert("Customer added successfully!");
        navigate(-1);
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      /* map known field errors from backend */
      const fieldMap = {
        email: "email",
        contact: "contact",
        AadharNo: "AadharNo",
        panCard: "panCard",
        name: "name",
        savingAccountNumber: "savingAccountNumber",
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
      if (!handled) setBackendError(serverMsg || "Failed to add customer. Please try again.");
    }
  };

  /* ─── field class helper ─────────────────────────────────── */
  const fieldClass = (hasError) =>
    `w-full p-3 border ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-yellow-400 bg-gray-50"
    } rounded-lg outline-none transition-colors duration-200`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-white p-5">
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
            <h2 className="text-xl font-semibold text-white">Add Customer</h2>
          </div>
          <button
            form="customerForm"
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-sm active:scale-95 transition-all"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {/* global backend error */}
        {backendError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            ⚠️ {backendError}
          </div>
        )}

        <form id="customerForm" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

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
                {...register("profilePicture", {
                  validate: {
                    fileType: (files) => {
                      if (!files?.[0]) return true;
                      return ["image/jpeg", "image/jpg", "image/png"].includes(files[0].type) ||
                        "Only JPG and PNG files are allowed";
                    },
                    fileSize: (files) => {
                      if (!files?.[0]) return true;
                      return files[0].size <= 5 * 1024 * 1024 || "File size must be under 5 MB";
                    },
                  },
                })}
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

              {/* Name */}
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

              {/* Email */}
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

              {/* Contact */}
              <Field label="Contact" required error={errors.contact}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                  placeholder="Enter Contact Number"
                  className={fieldClass(!!errors.contact)}
                />
              </Field>

              {/* Address */}
              <Field label="Address" required error={errors.address}>
                <input
                  type="text"
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 10, message: "Address must be at least 10 characters" },
                    maxLength: { value: 200, message: "Address cannot exceed 200 characters" },
                  })}
                  placeholder="Enter Full Address"
                  className={fieldClass(!!errors.address)}
                />
              </Field>

              {/* Gender */}
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

              {/* Password */}
              <Field label="Password" required error={errors.password}>
                <div className="relative">
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className={`${fieldClass(!!errors.password)} pr-10`}
                      />
                    )}
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

              {/* Agent */}
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

              {/* Aadhaar */}
              <Field label="Aadhaar Number" required error={errors.AadharNo}>
                <input
                  type="text"
                  maxLength={12}
                  {...register("AadharNo", {
                    required: "Aadhaar number is required",
                    minLength: { value: 12, message: "Aadhaar must be exactly 12 digits" },
                    maxLength: { value: 12, message: "Aadhaar must be exactly 12 digits" },
                    pattern: {
                      value: /^[2-9]\d{11}$/,
                      message: "Enter a valid 12-digit Aadhaar (cannot start with 0 or 1)",
                    },
                  })}
                  placeholder="Enter 12-digit Aadhaar"
                  className={fieldClass(!!errors.AadharNo)}
                />
              </Field>

              {/* PAN */}
              <Field label="PAN Card" required error={errors.panCard}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("panCard", {
                    required: "PAN card number is required",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Format: ABCDE1234F (5 letters, 4 digits, 1 letter)",
                    },
                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                  })}
                  placeholder="Enter PAN Card Number"
                  className={`${fieldClass(!!errors.panCard)} uppercase`}
                />
              </Field>

              {/* Saving AC Number */}
              <Field label="Saving AC Number" required error={errors.savingAccountNumber}>
                <input
                  type="text"
                  maxLength={20}
                  {...register("savingAccountNumber", {
                    required: "Account number is required",
                    minLength: { value: 9, message: "Account number must be at least 9 digits" },
                    pattern: { value: /^\d+$/, message: "Account number must contain only digits" },
                  })}
                  placeholder="Enter Saving Account Number"
                  className={fieldClass(!!errors.savingAccountNumber)}
                />
              </Field>

              {/* Signature */}
              <Field label="Signature (Upload)" required error={errors.signature}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  {...register("signature", {
                    required: "Signature is required",
                    validate: {
                      fileType: (files) => {
                        if (!files?.[0]) return "Signature is required";
                        return (
                          ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(files[0].type) ||
                          "Only JPG, PNG, or PDF allowed"
                        );
                      },
                      fileSize: (files) => {
                        if (!files?.[0]) return "Signature is required";
                        return files[0].size <= 2 * 1024 * 1024 || "File must be under 2 MB";
                      },
                    },
                  })}
                  className={fieldClass(!!errors.signature)}
                />
              </Field>

            </div>
          </section>

          {/* ── Nominee Details ──────────────────────────────── */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Nominee Details <span className="text-red-500">*</span>
            </h3>
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
                <select
                  {...register("NomineeDetails.relation", { required: "Relation is required" })}
                  className={fieldClass(!!errors?.NomineeDetails?.relation)}
                >
                  <option value="">Select Relation</option>
                  <option value="spouse">Spouse</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="other">Other</option>
                </select>
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
                      validAge: (v) => {
                        const age = calcAgeFromDob(v);
                        return (age >= 0 && age <= 120) || "Please enter a valid date of birth";
                      },
                    },
                  })}
                  className={fieldClass(!!errors?.NomineeDetails?.dob)}
                />
              </Field>

              {/* Age — auto-filled, still editable */}
              <Field label="Age" required error={errors?.NomineeDetails?.age}>
                <input
                  type="number"
                  min="0"
                  max="120"
                  {...register("NomineeDetails.age", {
                    required: "Age is required",
                    min: { value: 0, message: "Age must be at least 0" },
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
                  placeholder="Age"
                  className={fieldClass(!!errors?.NomineeDetails?.age)}
                />
              </Field>

              <Field label="Nominee Email" required error={errors?.NomineeDetails?.email}>
                <input
                  type="email"
                  {...register("NomineeDetails.email", {
                    required: "Nominee email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Enter Nominee Email"
                  className={fieldClass(!!errors?.NomineeDetails?.email)}
                />
              </Field>

              <Field label="Mobile Number" required error={errors?.NomineeDetails?.mobile}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                  placeholder="Enter Mobile Number"
                  className={fieldClass(!!errors?.NomineeDetails?.mobile)}
                />
              </Field>

              <Field label="Nominee Aadhaar" required error={errors?.NomineeDetails?.AadharNo}>
                <input
                  type="text"
                  maxLength={12}
                  {...register("NomineeDetails.AadharNo", {
                    required: "Nominee Aadhaar is required",
                    minLength: { value: 12, message: "Must be exactly 12 digits" },
                    maxLength: { value: 12, message: "Must be exactly 12 digits" },
                    pattern: {
                      value: /^[2-9]\d{11}$/,
                      message: "Valid 12-digit Aadhaar (cannot start with 0 or 1)",
                    },
                  })}
                  placeholder="Enter Nominee Aadhaar Number"
                  className={fieldClass(!!errors?.NomineeDetails?.AadharNo)}
                />
              </Field>

              <Field label="Nominee PAN" error={errors?.NomineeDetails?.panCard}>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.panCard", {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Format: ABCDE1234F",
                    },
                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                  })}
                  placeholder="Enter Nominee PAN (Optional)"
                  className={`${fieldClass(!!errors?.NomineeDetails?.panCard)} uppercase`}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Nominee Address" required error={errors?.NomineeDetails?.address}>
                  <textarea
                    rows={3}
                    {...register("NomineeDetails.address", {
                      required: "Nominee address is required",
                      minLength: { value: 10, message: "Address must be at least 10 characters" },
                      maxLength: { value: 200, message: "Address cannot exceed 200 characters" },
                    })}
                    placeholder="Enter Nominee's Complete Address"
                    className={`${fieldClass(!!errors?.NomineeDetails?.address)} resize-none`}
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

export default AddCustomer;