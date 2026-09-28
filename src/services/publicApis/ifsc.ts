import { fetchWithResilience, type ApiResponse } from './core';

export interface IfscDetails {
  bank: string;
  branch: string;
  address: string;
}

const fallbackIfsc: IfscDetails = {
  bank: "STATE BANK OF INDIA",
  branch: "MUMBAI MAIN",
  address: "MUMBAI SAMACHAR MARG, MUMBAI"
};

export const fetchIfsc = async (ifsc: string): Promise<ApiResponse<IfscDetails>> => {
  return fetchWithResilience(
    `ifsc_${ifsc}`,
    async () => {
      const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      if (!response.ok) throw new Error('Invalid IFSC or network error');
      const data = await response.json();
      return {
        bank: data.BANK,
        branch: data.BRANCH,
        address: data.ADDRESS
      };
    },
    fallbackIfsc
  );
};
