import mongoose from 'mongoose';
import {
  IsArray,
  isArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;
  @IsNotEmpty({ message: 'description khong duoc de trong' })
  description: string;
  @IsNotEmpty({ message: 'description khong duoc de trong' })
  @IsBoolean({ message: 'is active co tri boolean' })
  isActive: boolean;
  @IsNotEmpty({ message: 'permisson khong duoc de trong' })
  @IsMongoId({ each: true, message: 'each person la mongo db object' })
  @IsArray({ message: 'permission co dinh danh la array ' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
