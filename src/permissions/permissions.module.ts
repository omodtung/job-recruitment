import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permissions, PermissionsSchema } from './schema/permissions.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [MongooseModule.forFeature([{ name: Permissions.name, schema: PermissionsSchema }])],
})
export class PermissionsModule {}
