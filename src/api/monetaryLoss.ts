import { authFetch } from '../utils/authFetch';
import { MonetaryLossSummary } from '../types/monetaryLoss';
import { convertToMonetaryLossSummary } from '../lib/monetaryLossUtils';
import { env } from '../lib/env';

const BASE_URL = env.API_BASE_URL;

// Actual total loss data from the provided JSON
const ACTUAL_LOSS_DATA = {
  "House Fully": 7352000000.0,
  "House Partially": 8589000000.0,
  "Big cattles": 937763103.9599999,
  "small Cattles": 351280000.0,
  "Educational Facilities Damaged fully": 2083000000.0,
  "Educational Facilities Damaged Partially": 987000000.0,
  "HED facilities Damaged": 14400000.0,
  "Public Offices": 603000000.0,
  "Shops": 3220000000.0,
  "Roads in Km restoration": 463303536.0,
  "Roads in Km rehabiliation": 2701011831.0,
  "Bridges in meter restoration": 6226780.0,
  "Bridges in meter rehabiliation": 49483704.0,
  "Culverts in Meter restoration": 1628175.0,
  "Culverts in Meter rehabiliation": 5780225.0,
  "Vehicles": 300000000.0,
  "Health facilities": 320000000.0,
  "Fodders roughes": 126270000.0,
  "Fodders concentrate": 20842500.0,
  "Shelters": 252000000.0,
  "Crops destruction": 6418850000.0,
  "Transformers": 2000000000.0,
  "services": 100658000.0,
  "Local government": 1008000000.0,
  "Energy and Power": 402000000.0,
  "irrigation": 9227000000.0,
  "public health": 1070000000.0
};

const fetchEndpointData = async (endpoint: string) => {
  try {
    const response = await authFetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchMonetaryLossData = async (): Promise<MonetaryLossSummary> => {
  try {
    // Use actual data in development and production (since backend APIs are not available)
    console.log('Using actual loss data for monetary loss calculations');
    return convertToMonetaryLossSummary(ACTUAL_LOSS_DATA);

    // Endpoints to fetch data from
    const endpoints = {
      infrastructure: '/api/incidents/infrastructure-damage',
      property: '/api/incidents/property-damage',
      vehicles: '/api/incidents/vehicle-damage',
      livestock: '/api/livestock/losses',
      agriculture: '/api/agriculture/losses',
      services: '/api/incidents/services-damage'
    };

    // Fetch data from all endpoints
    const results = await Promise.allSettled(
      Object.values(endpoints).map(endpoint => fetchEndpointData(endpoint))
    );

    // Process results and handle partial failures
    const combinedData = {};
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        Object.assign(combinedData, result.value);
      } else {
        errors.push(`Failed to fetch ${Object.keys(endpoints)[index]}: ${result.reason}`);
      }
    });

    // If we have some data but not all, we can still show partial results
    if (Object.keys(combinedData).length > 0) {
      console.warn('Some data endpoints failed:', errors);
      return convertToMonetaryLossSummary(combinedData);
    }

    // If all endpoints failed, throw an error
    if (errors.length === Object.keys(endpoints).length) {
      throw new Error('Failed to fetch monetary loss data from all endpoints');
    }

    return convertToMonetaryLossSummary(combinedData);
  } catch (error) {
    console.error('Error in fetchMonetaryLossData:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to load monetary loss data: ${error.message}`
        : 'Failed to load monetary loss data'
    );
  }
};