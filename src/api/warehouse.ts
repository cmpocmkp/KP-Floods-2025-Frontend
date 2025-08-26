// Warehouse API functions
export interface StockByDivision {
  name: string;
  value: number;
}

export interface IssuedTrend {
  date: string;
  items: number;
}

export interface TopItem {
  id: number;
  item: string;
  available: number;
  issued: number;
  remaining: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const getStockByDivision = async (): Promise<StockByDivision[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/warehouse/stock-by-division`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock by division: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getItemsIssuedTrend = async (): Promise<IssuedTrend[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/warehouse/items-issued-trend`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch items issued trend: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getTopItems = async (): Promise<TopItem[]> => {
  const baseUrl = 'https://kp-floods-2025-mongo-backend-production.up.railway.app';
  const response = await fetch(`${baseUrl}/floods/warehouse/top-items`, {
    headers: {
      'Accept': '*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top items: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const getWarehouseDetails = async () => {
  const [stockByDivision, issuedTrend, topItems] = await Promise.all([
    getStockByDivision(),
    getItemsIssuedTrend(),
    getTopItems()
  ]);

  return {
    stockByDivision,
    issuedTrend,
    topItems
  };
};