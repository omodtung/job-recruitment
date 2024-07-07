import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Permissions, PermissionsSchema } from "@/permissions/schema/permissions.schema";
import { roles, rolesSchema } from "@/roles/schemas/roles.schema";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    MongooseModule.forFeature([{ name: roles.name, schema: rolesSchema }]),

  ],
  exports: [RolesService],
})
export class RolesModule {}
