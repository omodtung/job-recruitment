import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  // @IsNotEmpty()
  email: string;
  // @IsNotEmpty()
  userId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  url: string;
  // @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  @IsMongoId({message : 'company is a mongodb id'})
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId({message : 'jobId is a mongodb id'})
  jobId: mongoose.Schema.Types.ObjectId;
}
