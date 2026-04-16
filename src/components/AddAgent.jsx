import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const AddAgent = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [previewSignature, setPreviewSignature] = useState(null);
  const [newSignatureFile, setNewSignatureFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const token = sessionStorage.getItem("token");
  const managerId = JSON.parse(sessionStorage.getItem("user"))._id;

  // Auto-calculate age from DOB
  const nomineeDoB = watch("NomineeDetails.dob");
  useEffect(() => {
    if (nomineeDoB) {
      const today = new Date();
      const birth = new Date(nomineeDoB);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 120) {
        setValue("NomineeDetails.age", age, { shouldValidate: true });
      }
    }
  }, [nomineeDoB, setValue]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/areaManager?managerId=${managerId}&all=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setManagers(res.data.data || []);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
    fetchManagers();
  }, []);

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const formData = new FormData();
      for (let key in data) {
        if (key === "signature" && data.signature[0]) {
          formData.append("signature", data.signature[0]);
        } else if (key === "NomineeDetails") {
          Object.keys(data.NomineeDetails).forEach((nkey) => {
            formData.append(`NomineeDetails[${nkey}]`, data.NomineeDetails[nkey]);
          });
        } else {
          formData.append(key, data[key]);
        }
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/agent`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Agent added successfully ✅");
      navigate(-1);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add agent ❌";
      setSubmitError(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const inputClass = (hasError) =>
    `w-full p-3 border ${hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-200 focus:border-yellow-400"
    } rounded-lg bg-gray-50 outline-none duration-200`;

  return (
    <div className="min-h-screen p-4 flex justify-center items-center">
      <div className="w-full shadow-lg rounded-xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-yellow-500 p-2 rounded-full border transition-colors"
              title="Back"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-xl font-semibold tracking-wide text-white">Add Agent</h2>
          </div>
          <button
            type="submit"
            form="addAgentForm"
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg shadow-sm active:scale-95 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Backend error banner */}
        {submitError && (
          <div className="mx-8 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <form id="addAgentForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 grid md:grid-cols-2 gap-6">

            {/* Agent Name */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
                  pattern: {
                    value: /^[a-zA-Z]+(\s[a-zA-Z]+)*$/,
                    message: "Name can only contain letters; no leading, trailing, or double spaces",
                  },
                })}
                placeholder="Enter Agent Name"
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="Enter Email Address"
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Must be a valid 10-digit Indian mobile number starting with 6-9",
                  },
                })}
                placeholder="Enter Contact Number"
                className={inputClass(errors.contact)}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={12}
                {...register("AadharNo", {
                  required: "Aadhaar number is required",
                  minLength: { value: 12, message: "Aadhaar number must be exactly 12 digits" },
                  maxLength: { value: 12, message: "Aadhaar number must be exactly 12 digits" },
                  pattern: {
                    value: /^[2-9]\d{11}$/,
                    message: "Aadhaar must be 12 digits and cannot start with 0 or 1",
                  },
                })}
                placeholder="Enter 12-digit Aadhaar Number"
                className={inputClass(errors.AadharNo)}
              />
              {errors.AadharNo && <p className="text-red-500 text-xs mt-1">{errors.AadharNo.message}</p>}
            </div>

            {/* PAN */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                PAN Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                {...register("panCard", {
                  required: "PAN Card is required",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)",
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  },
                })}
                placeholder="Enter PAN Card Number"
                className={`${inputClass(errors.panCard)} uppercase`}
              />
              {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard.message}</p>}
            </div>

            {/* Signature */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Signature <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                {...register("signature", {
                  required: "Signature upload is required",
                  validate: {
                    fileType: (files) => {
                      if (!files[0]) return "Signature is required";
                      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
                      return allowedTypes.includes(files[0].type) || "Only JPG, PNG, or PDF files are allowed";
                    },
                    fileSize: (files) => {
                      if (!files[0]) return "Signature is required";
                      return files[0].size <= 2 * 1024 * 1024 || "File size must be less than 2MB";
                    },
                  },
                })}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewSignatureFile(file);
                    setPreviewSignature(URL.createObjectURL(file));
                  }
                }}
                className={inputClass(errors.signature)}
              />
              {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature.message}</p>}
              {previewSignature && (
                <div className="mt-2">
                  {previewSignature.endsWith(".pdf") ? (
                    <embed src={previewSignature} type="application/pdf" className="h-32 border rounded" />
                  ) : (
                    <img src={previewSignature} alt="Signature Preview" className="h-24 border rounded" />
                  )}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 10, message: "Address must be at least 10 characters" },
                  maxLength: { value: 200, message: "Address cannot exceed 200 characters" },
                })}
                placeholder="Enter Complete Address"
                className={inputClass(errors.address)}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: "Must contain uppercase, lowercase, number and special character",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className={`${inputClass(errors.password)} pr-10`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender", { required: "Gender selection is required" })}
                className={inputClass(errors.gender)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Area Manager */}
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-700">
                Area Manager <span className="text-red-500">*</span>
              </label>
              <select
                {...register("areaManagerId", { required: "Manager selection is required" })}
                className={inputClass(errors.areaManagerId)}
              >
                <option value="">Select Manager</option>
                {managers.map((mng) => (
                  <option key={mng._id} value={mng._id}>
                    {mng.name}
                  </option>
                ))}
              </select>
              {errors.areaManagerId && <p className="text-red-500 text-xs mt-1">{errors.areaManagerId.message}</p>}
            </div>
          </div>

          {/* Guarantor / Nominee Section */}
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">
              Guarantor Details <span className="text-red-500">*</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Nominee Name */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("NomineeDetails.name", {
                    required: " name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                    pattern: {
                      value: /^[a-zA-Z]+(\s[a-zA-Z]+)*$/,
                      message: "Name can only contain letters; no leading, trailing, or double spaces",
                    },
                  })}
                  placeholder="Enter  Name"
                  className={inputClass(errors?.NomineeDetails?.name)}
                />
                {errors?.NomineeDetails?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.name.message}</p>
                )}
              </div>

              {/* Relation */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Relation <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("NomineeDetails.relation", { required: "Relation is required" })}
                  className={inputClass(errors?.NomineeDetails?.relation)}
                >
                  <option value="">Select Relation</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
                {errors?.NomineeDetails?.relation && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.relation.message}</p>
                )}
              </div>

              {/* Date of Birth — drives Age */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("NomineeDetails.dob", {
                    required: "Date of birth is required",
                    validate: {
                      notFuture: (value) =>
                        new Date(value) <= new Date() || "Date of birth cannot be in the future",
                    },
                  })}
                  className={inputClass(errors?.NomineeDetails?.dob)}
                />
                {errors?.NomineeDetails?.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.dob.message}</p>
                )}
              </div>

              {/* Age — read-only, auto-calculated */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Age <span className="text-red-500">*</span>{" "}
                  <span className="text-gray-400 font-normal text-xs">(auto-calculated from DOB)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  readOnly
                  {...register("NomineeDetails.age", {
                    required: "Age is required (select a DOB)",
                    min: { value: 1, message: "Age must be at least 1" },
                    max: { value: 120, message: "Age cannot exceed 120" },
                    valueAsNumber: true,
                  })}
                  placeholder="Auto-filled from DOB"
                  className={`${inputClass(errors?.NomineeDetails?.age)} cursor-not-allowed bg-gray-100`}
                />
                {errors?.NomineeDetails?.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.age.message}</p>
                )}
              </div>

              {/* Nominee Email */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("NomineeDetails.email", {
                    required: "Nominee email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  placeholder="Enter Email Address"
                  className={inputClass(errors?.NomineeDetails?.email)}
                />
                {errors?.NomineeDetails?.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.email.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Must be a valid 10-digit Indian mobile number starting with 6-9",
                    },
                  })}
                  placeholder="Enter Mobile Number"
                  className={inputClass(errors?.NomineeDetails?.mobile)}
                />
                {errors?.NomineeDetails?.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.mobile.message}</p>
                )}
              </div>

              {/* Nominee Aadhaar */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={12}
                  {...register("NomineeDetails.AadharNo", {
                    required: "Nominee's Aadhaar number is required",
                    minLength: { value: 12, message: "Aadhaar number must be exactly 12 digits" },
                    maxLength: { value: 12, message: "Aadhaar number must be exactly 12 digits" },
                    pattern: {
                      value: /^[2-9]\d{11}$/,
                      message: "Aadhaar must be 12 digits and cannot start with 0 or 1",
                    },
                  })}
                  placeholder="Enter Aadhaar Number"
                  className={inputClass(errors?.NomineeDetails?.AadharNo)}
                />
                {errors?.NomineeDetails?.AadharNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.AadharNo.message}</p>
                )}
              </div>

              {/* Nominee PAN */}
              <div>
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  PAN Card
                </label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("NomineeDetails.panCard", {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                  placeholder="Enter PAN Card Number (optional)"
                  className={`${inputClass(errors?.NomineeDetails?.panCard)} uppercase`}
                />
                {errors?.NomineeDetails?.panCard && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.panCard.message}</p>
                )}
              </div>

              {/* Nominee Address */}
              <div className="md:col-span-2">
                <label className="block font-semibold text-sm mb-1 text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  {...register("NomineeDetails.address", {
                    required: "Nominee address is required",
                    minLength: { value: 10, message: "Address must be at least 10 characters" },
                    maxLength: { value: 200, message: "Address cannot exceed 200 characters" },
                  })}
                  placeholder="Enter Complete Address"
                  className={`${inputClass(errors?.NomineeDetails?.address)} resize-none`}
                />
                {errors?.NomineeDetails?.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.NomineeDetails.address.message}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;