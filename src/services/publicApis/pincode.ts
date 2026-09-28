import { fetchWithResilience, type ApiResponse } from './core';

export interface PincodeDetails {
  district: string;
  state: string;
  postOffices: string[];
}

const fallbackPincode: PincodeDetails = {
  district: "Pune",
  state: "Maharashtra",
  postOffices: ["Hinjawadi", "Wakad"]
};

export const fetchPincode = async (pincode: string): Promise<ApiResponse<PincodeDetails>> => {
  return fetchWithResilience(
    `pincode_${pincode}`,
    async () => {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      if (data[0].Status !== 'Success') throw new Error('Invalid pincode');
      
      const postOffices = data[0].PostOffice;
      return {
        district: postOffices[0].District,
        state: postOffices[0].State,
        postOffices: postOffices.map((po: any) => po.Name)
      };
    },
    fallbackPincode
  );
};
