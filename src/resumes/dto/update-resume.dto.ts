import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  //
  @IsNotEmpty({ message: 'history khong duoc de trong' })
  @IsArray({ message: 'history duoc dinh dang la array' })
  @ValidateNested()
  @Type(() => History)
  history: History[];
}

class UpdatedBy {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  status: string;
  updatedAt: Date;
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}
