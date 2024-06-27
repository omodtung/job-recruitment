import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop()
  name: string;

  @Prop()
  skill: string;

  @Prop()
  company: string;

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
}

export const JobSchema = SchemaFactory.createForClass(Job);
