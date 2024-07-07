import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { roles, rolesSchema } from '@/roles/schemas/roles.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '@/users/users.service';
import { Permissions, PermissionsSchema } from '@/permissions/schema/permissions.schema';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService,UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Permissions.name, schema: PermissionsSchema }]),
    MongooseModule.forFeature([{ name: roles.name, schema: rolesSchema }]),
  ],
})
export class DatabasesModule {}
