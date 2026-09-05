export interface ProductDto {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brandId: number;
  typeId: number;
  productBrand: string;
  productType: string;
}

export interface BrandDto {
  id: number;
  name: string;
}

export interface TypeDto {
  id: number;
  name: string;
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface ProductQueryParams {
  brandId?: number | null;
  typeId?: number | null;
  sort?: number;
  searchValue?: string;
  pageIndex?: number;
  pageSize?: number;
}