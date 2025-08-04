'use client';

import React, { useState, useEffect } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'] });

const propertyTypeOptions = [
  'Residential',
  'Commercial',
  'Land',
  'Luxury',
  'Appartment',
  'Villa',
  'Penthouse',
];

interface InquirySectionProps {
  defaultPropertyType?: string;
  defaultPropertyId?: string;
}
const InquirySection: React.FC<InquirySectionProps> = ({ defaultPropertyType, defaultPropertyId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: defaultPropertyType || '',
    propertyId: defaultPropertyId || '',
    agree: false
  });
  type Property = { _id: string; name: string; propertyType: string };
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAllProperties(data.properties);
      });
  }, []);

  useEffect(() => {
    if (formData.propertyType) {
      const filtered = allProperties.filter((p) => p.propertyType === formData.propertyType);
      setFilteredProperties(filtered);
      // Only reset propertyId if it's not in the filtered list
      if (!filtered.some(p => p._id === formData.propertyId)) {
        setFormData(prev => ({ ...prev, propertyId: '' }));
      }
    } else {
      setFilteredProperties([]);
      setFormData(prev => ({ ...prev, propertyId: '' }));
    }
  }, [formData.propertyType, allProperties]);

  // If defaultPropertyType or defaultPropertyId change (e.g. on navigation), update form
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      propertyType: defaultPropertyType || '',
      propertyId: defaultPropertyId || '',
    }));
  }, [defaultPropertyType, defaultPropertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    const name = formData.fullName.trim();
    const phone = formData.phone.trim();
    const phonePattern = /^\d{10}$/;
    if (!name || name === '.' || /^\.+$/.test(name)) {
      alert('Name cannot be empty, only spaces, or only dots.');
      return;
    }
    if (!phonePattern.test(phone)) {
      alert('Please enter a valid 10 digit phone number (digits only).');
      return;
    }
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert('Inquiry submitted successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          propertyType: '',
          propertyId: '',
          agree: false
        });
      } else {
        alert(data.message || 'Failed to submit inquiry.');
      }
    } catch (error) {
      alert('Failed to submit inquiry.');
    }
  };

  return (
    <section className="flex flex-col items-center py-10 px-10 md:px-40 w-full bg-[#0A0A0A]">
      <div className="w-full max-w-[1100px] flex flex-col">
        <div className="bg-[#141414] rounded-2xl p-6 md:p-10 w-full">
          <div className="flex flex-col items-center gap-1 mb-10">
            <h2 className={`${bricolage.className} text-2xl font-medium text-white text-center`}>
              Inquire Now
            </h2>
            <p className="text-[#E0E0E0] text-base text-center">
              Schedule a site visit or request more information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-1 flex flex-col gap-2 min-w-[120px]">
                  <label className="text-sm text-white">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="bg-[#0A0A0A] text-[#E0E0E0] text-sm p-3.5 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 min-w-[120px]">
                  <label className="text-sm text-white">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="bg-[#0A0A0A] text-[#E0E0E0] text-sm p-3.5 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2 min-w-[120px]">
                  <label className="text-sm text-white">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="bg-[#0A0A0A] text-[#E0E0E0] text-sm p-3.5 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {/* Hidden propertyType and propertyId fields for property detail page only */}
              <input type="hidden" name="propertyType" value={formData.propertyType} />
              <input type="hidden" name="propertyId" value={formData.propertyId} />
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                required
              />
              <label htmlFor="agree" className="text-sm text-[#A5A5A5]">
                I agree to receive communications about the real estate universe Group and other projects from the developer.
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 bg-[#E50914] text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-red-700 transition-colors duration-200"
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default InquirySection;
