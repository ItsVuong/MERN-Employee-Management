export interface GetUserDto {
  id?: string;
  fullName?: string;
  gender?: string;
  department?: string;
  phone?: string;
  email?: string;
  role?: string;
  minSalary?: string;
  maxSalary?: string;
  startDate?: string;
  pageSize?: number, currentPage?: number
}

export interface UpdateUserDto {
  fullName?: string;
  gender?: string;
  address?: string;
  department?: string;
  phone?: string;
  email?: string;
  role?: string;
  dob?: Date;
  password?: string;
  startDate?: Date;
  baseSalary?: { amount: number, startDate: Date, endDate: Date };
  profileImage?: { url: string, name: string },
}

export interface UpdatePasswordDto {
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
