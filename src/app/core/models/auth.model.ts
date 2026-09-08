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

export interface RegisterResultDto {
  email: string;
  displayName: string;
  message: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface CurrentUser {
  email: string;
  displayName: string;
  isAdmin: boolean;
}