import { LossRate, MonetaryLossCategory, MonetaryLossSummary, MonetaryLossItem } from '../types/monetaryLoss';
import { LOSS_CATEGORIES } from './monetaryLossRates';

export const getLossRateByType = (type: string): number => {
  const rate = LOSS_RATES.find(rate => rate.type === type);
  return rate ? rate.value : 0;
};

export const calculateItemLoss = (type: string, totalLoss: number): MonetaryLossItem => {
  return {
    type,
    totalLoss,
    percentage: 0 // Will be calculated later
  };
};

export const calculateCategoryLoss = (
  category: string,
  items: MonetaryLossItem[]
): MonetaryLossCategory => {
  const totalLoss = items.reduce((sum, item) => sum + item.totalLoss, 0);
  return {
    category,
    items,
    totalLoss
  };
};

export const convertToMonetaryLossSummary = (
  data: Record<string, number>
): MonetaryLossSummary => {
  const categories = Object.entries(LOSS_CATEGORIES).map(([category, types]) => {
    const items = types
      .map(type => {
        const totalLoss = data[type] || 0;
        return calculateItemLoss(type, totalLoss);
      })
      .filter(item => item.totalLoss > 0); // Only include items with actual losses
    
    return calculateCategoryLoss(category, items);
  }).filter(category => category.totalLoss > 0); // Only include categories with losses

  const totalLossInRupees = categories.reduce(
    (sum, category) => sum + category.totalLoss,
    0
  );

  // Calculate percentages for each item
  categories.forEach(category => {
    category.items.forEach(item => {
      item.percentage = (item.totalLoss / totalLossInRupees) * 100;
    });
  });

  return {
    categories,
    totalLossInBillions: totalLossInRupees / 1_000_000_000,
    totalLossInRupees
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};