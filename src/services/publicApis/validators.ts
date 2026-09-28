export const validators = {
  isValidPan: (pan: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  },
  
  isValidIfsc: (ifsc: string): boolean => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  },
  
  isValidPincode: (pincode: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  },
  
  isValidMobile: (mobile: string): boolean => {
    return /^[6-9]\d{9}$/.test(mobile);
  },

  isValidGstin: (gstin: string): boolean => {
    // Basic format: 2-digit state code, PAN (10), Entity number (1), Z (1), Checksum (1)
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!regex.test(gstin.toUpperCase())) return false;
    // (Optional) Here you would do the actual GSTIN checksum calculation,
    // but for demo purposes, passing the regex is sufficient.
    return true;
  }
};
