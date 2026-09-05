export interface ProductFormPayload {
  id?: number;
  name: string;
  description: string;
  pictureUrl?: string;
  price: number;
  brandId: number;
  typeId: number;
}

export interface NameFormPayload {
  id?: number;
  name: string;
}

export interface AdminUser {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  roles: string[];
}

export interface AdminRole {
  id: string;
  name: string;
}