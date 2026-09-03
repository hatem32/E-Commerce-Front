export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
  displayName: string;
  phoneNumber?: string;
}

export interface UserDto {
  email: string;
  token: string;
  displayName: string;
}

export interface CurrentUser {
  email: string;
  displayName: string;
  isAdmin: boolean;
}