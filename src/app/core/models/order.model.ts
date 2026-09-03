export interface AddressDto {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  country: string;
}

export interface DeliveryMethodDto {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  cost: number;
}

export interface OrderDto {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: AddressDto;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface OrderToReturnDto {
  id: string;
  buyerEmail: string;
  orderDate: string;
  items: OrderItemDto[];
  shipToAddress: AddressDto;
  deliveryMethod: string;
  status: string;
  subTotal: number;
  deliveryCost: number;
  total: number;
}