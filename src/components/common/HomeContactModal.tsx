import React, { useState, useEffect } from 'react';
import ContactInquirySection from '@/sections/projects/ContactInquirySection';

const HomeContactModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    // Check if the popup was previously closed in this session
    const popupClosed = sessionStorage.getItem('popupClosed');
    setOpen(!popupClosed);
  }, []);

  const handleClose = () => {
    // Set a flag in sessionStorage when the popup is closed
    sessionStorage.setItem('popupClosed', 'true');
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="relative w-full flex justify-center items-center">
        <div className="relative w-full max-w-6xl">
          {/* <ContactInquirySection onClose={handleClose} /> */}
          <ContactInquirySection isPopup onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default HomeContactModal;
