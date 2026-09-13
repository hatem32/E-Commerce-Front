export interface TopProductDto {
  productId: number;
  productName: string;
  pictureUrl: string;
  quantitySold: number;
  revenue: number;
}

export interface DailyRevenueDto {
  date: string;
  revenue: number;
}

export interface AdminStatsDto {
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  failedOrdersCount: number;
  topSellingProducts: TopProductDto[];
  topRevenueProducts: TopProductDto[];
  revenueLast7Days: DailyRevenueDto[];
}