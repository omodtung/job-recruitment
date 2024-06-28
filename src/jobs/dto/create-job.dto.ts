import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'NAME KHONG DUOC DE TRONG' })
  name: string;

  @IsArray({ message: 'Skill co dinh dang array' })
  @IsNotEmpty({ message: 'skill khong duoc de trong' })
  @IsString({ each: true, message: 'Skill phai la stringu' })
  skill: string[];
  @IsNotEmpty({ message: 'salary không được để trống' })
  salary: number;
  @IsNotEmpty({ message: 'QUANTITY không được để trống' })
  quantity: string;

  @IsNotEmpty({ message: 'level khong duoc de trongi' })
  level: string;

  @IsEmail({}, { message: 'discription  không đúng định dạng' })
  @IsNotEmpty({ message: 'discription không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate co Dinh dang Date' })
  startDate: Date;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate co Dinh dang Date' })
  endDate: Date;

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
