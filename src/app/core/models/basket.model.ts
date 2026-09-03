export interface BasketItemDto {
  id: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface BasketDto {
  id: string;
  items: BasketItemDto[];
  paymentIntentId?: string | null;
  deliveryMethodId?: number | null;
  shippingPrice?: number | null;
  clientSecret?: string | null;
}