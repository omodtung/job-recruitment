import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'NAME KHONG DUOC DE TRONG' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'age Ko Duoc De Trong ' })
  age: number;

  @IsNotEmpty({ message: 'gender Ko Duoc De Trong ' })
  gender: string;

  @IsNotEmpty({ message: 'address Ko Duoc De Trong ' })
  address: string;

  @IsNotEmpty({ message: 'role Ko Duoc De Trong ' })
  role: string;
  @IsNotEmpty({ message: 'refresh Token Ko Duoc De Trong ' })
  refreshToken: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
export class RegisterUserDto {
  @IsNotEmpty({ message: 'NAME KHONG DUOC DE TRONG' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'age Ko Duoc De Trong ' })
  age: number;

  @IsNotEmpty({ message: 'gender Ko Duoc De Trong ' })
  gender: string;

  @IsNotEmpty({ message: 'address Ko Duoc De Trong ' })
  address: string;

  @IsNotEmpty({ message: 'role Ko Duoc De Trong ' })
  role: string;
  @IsNotEmpty({ message: 'refresh Token Ko Duoc De Trong ' })
  refreshToken: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
