import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Company } from '@/companies/schemas/company.schema';
import { Job } from '@/jobs/schemas/jobs.schema';
import {Permissions} from "@/permissions/schema/permissions.schema";

export type rolesDocument = HydratedDocument<roles>;

@Schema({ timestamps: true })
export class roles {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Permissions.name })
  permissions: Permissions[];
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

export const rolesSchema = SchemaFactory.createForClass(roles);
