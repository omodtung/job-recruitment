import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop()
  name: string;

  @Prop()
  skill: string[];

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  location: string;
  @Prop()
  salary: number;
  @Prop()
  quantity: string;
  @Prop()
  level: string;
  @Prop()
  description: string;

  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;

  @Prop()
  isActive: Boolean;


  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deleteBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
