export interface CampDetailsByDistrictItem {
  key_id: number;
  item_value: number;
  item_title: string;
  last_updated: string;
  _id: string;
}

export interface CampDetailsByDistrictResponse {
  success: boolean;
  total_camps: number;
  result: CampDetailsByDistrictItem[];
  last_updated: string;
}

export const getCampsDetailsByDistrict = async (): Promise<CampDetailsByDistrictResponse> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const url = `${baseUrl}/floods/camps/details-by-district`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch camp details by district: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};