// src/components/StepOne.jsx

import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

function generateCaptcha(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let captcha = ''
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return captcha
}

export default function StepOne({ formData, handleChange, handleFileChange, errors }) {
  const [captcha, setCaptcha] = useState('')

  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
  }

  // Unified file‐select handler:
  const handleFileSelect = (e) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      handleFileChange(e) // Parent will store “files[0]” into formData[name]
    }
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Student Information</h2>

      {/* --- PERSONAL INFO --- */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
         Email ID <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="your.name@college.edu"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
          College Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="collegeName"
          name="collegeName"
          value={formData.collegeName || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.collegeName ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your college name"
        />
        {errors.collegeName && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.collegeName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-1">
          Current Year <span className="text-red-500">*</span>
        </label>
        <select
          id="currentYear"
          name="currentYear"
          value={formData.currentYear || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.currentYear ? 'border-red-500' : 'border-gray-300'
          } text-gray-700`}
        >
          <option value="" disabled hidden>
            Select your current year
          </option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
        </select>
        {errors.currentYear && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.currentYear}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.department ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your department"
        />
        {errors.department && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.department}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          maxLength={10}
          className={`w-full px-3 py-2 border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="10-digit number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* --- ALTERNATE PHONE (OPTIONAL) --- */}
      <div>
        <label htmlFor="otherPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Alternate Phone Number
        </label>
        <input
          type="tel"
          id="otherPhone"
          name="otherPhone"
          value={formData.otherPhone || ''}
          onChange={handleChange}
          maxLength={10}
          className={`w-full px-3 py-2 border ${
            errors.otherPhone ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="10-digit number"
        />
        {errors.otherPhone && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.otherPhone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="aadharNumber"
          name="aadharNumber"
          value={formData.aadharNumber || ''}
          onChange={handleChange}
          maxLength={12}
          pattern="\d*"
          className={`w-full px-3 py-2 border ${
            errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="12-digit Aadhaar number"
        />
        {errors.aadharNumber && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.aadharNumber}
          </p>
        )}
      </div>

      {/* --- ACADEMIC INFO --- */}
      <div>
        <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
          CGPA <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="10"
          id="cgpa"
          name="cgpa"
          value={formData.cgpa || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.cgpa ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="e.g., 8.5"
        />
        {errors.cgpa && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.cgpa}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="areaOfInterest" className="block text-sm font-medium text-gray-700 mb-1">
          Area of Interest <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="areaOfInterest"
          name="areaOfInterest"
          value={formData.areaOfInterest || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.areaOfInterest ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="e.g., Domain"
        />
        {errors.areaOfInterest && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.areaOfInterest}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Experience <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="experience"
          name="experience"
          value={formData.experience || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.experience ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="e.g., Machine Learning, Deep Learning"
        />
        {errors.experience && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.experience}
          </p>
        )}
      </div>

      {/* --- FAMILY INFO --- */}
      <div>
        <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
          Father's Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fatherName"
          name="fatherName"
          value={formData.fatherName || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.fatherName ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter father's name"
        />
        {errors.fatherName && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.fatherName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
          Mother's Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="motherName"
          name="motherName"
          value={formData.motherName || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.motherName ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter mother's name"
        />
        {errors.motherName && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.motherName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="fatherPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Parent's Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="fatherPhone"
          name="fatherPhone"
          value={formData.fatherPhone || ''}
          onChange={handleChange}
          maxLength={10}
          className={`w-full px-3 py-2 border ${
            errors.fatherPhone ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="10-digit number"
        />
        {errors.fatherPhone && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.fatherPhone}
          </p>
        )}
      </div>

      {/* --- ADDRESS --- */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Permanent Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={formData.address || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter your permanent address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.address}
          </p>
        )}
      </div>

      {/* --- UPLOADS --- */}

      <div>
        <label htmlFor="aadhaarFile" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Aadhaar Card <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="aadhaarFile"
          name="aadhaarFile"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {formData.aadhaarFile && (
          <p className="mt-1 text-sm text-gray-700">
            Selected file: {formData.aadhaarFile.name}
          </p>
        )}
        {errors.aadhaarFile && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.aadhaarFile}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="idCardFile" className="block text-sm font-medium text-gray-700 mb-1">
          Upload College ID Card <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="idCardFile"
          name="idCardFile"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {formData.idCardFile && (
          <p className="mt-1 text-sm text-gray-700">
            Selected file: {formData.idCardFile.name}
          </p>
        )}
        {errors.idCardFile && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.idCardFile}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Resume <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="resumeFile"
          name="resumeFile"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {formData.resumeFile && (
          <p className="mt-1 text-sm text-gray-700">
            Selected file: {formData.resumeFile.name}
          </p>
        )}
        {errors.resumeFile && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.resumeFile}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nocFile" className="block text-sm font-medium text-gray-700 mb-1">
          Upload NOC <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="nocFile"
          name="nocFile"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {formData.nocFile && (
          <p className="mt-1 text-sm text-gray-700">
            Selected file: {formData.nocFile.name}
          </p>
        )}
        {errors.nocFile && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.nocFile}
          </p>
        )}
      </div>

      {/* --- ACCOMMODATION TYPE --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accommodation Type <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="studentType"
              value="Day Scholar"
              checked={formData.studentType === 'Day Scholar'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Day Scholar</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="studentType"
              value="Hosteller"
              checked={formData.studentType === 'Hosteller'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Hosteller</span>
          </label>
        </div>
        {errors.studentType && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.studentType}
          </p>
        )}
      </div>

      {/* --- CAPTCHA --- */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Captcha <span className="text-red-500">*</span>
        </label>
        <div className="mb-2 p-2 bg-gray-100 rounded-md text-center flex items-center justify-between">
          <span className="font-mono text-lg tracking-wider text-gray-700">{captcha}</span>
          <button
            type="button"
            onClick={refreshCaptcha}
            aria-label="Refresh Captcha"
            className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <input
          type="text"
          name="captcha"
          value={formData.captcha || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.captcha ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter the characters above"
        />
        {errors.captcha && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.captcha}
          </p>
        )}
      </div>
    </div>
  )
}
