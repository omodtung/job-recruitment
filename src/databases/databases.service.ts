import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Permissions, PermissionsDocument } from '@/permissions/schema/permissions.schema';
import { roles, rolesDocument } from '@/roles/schemas/roles.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { INIT_PERMISSIONS,ADMIN_ROLE,USER_ROLE } from './sample';
// import { Logger } from '@nestjs/common';
@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private  userModel :SoftDeleteModel<UserDocument>,
    @InjectModel(Permissions.name)
    private  permissionModel :SoftDeleteModel<PermissionsDocument>,
    @InjectModel(roles.name)
    private  rolesModel :SoftDeleteModel<rolesDocument>,
    private configService : ConfigService,
    private userService :UsersService
  )
  {

  }
  async onModuleInit() {
    const isInit = this.configService.get<string>("SHOULD_INIT");
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.rolesModel.count({});

      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        //bulk create
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select("_id");
        await this.rolesModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: "Admin thì full quyền :v",
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: "Người dùng/Ứng viên sử dụng hệ thống",
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.rolesModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.rolesModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            name: "I'm admin",
            email: "admin@gmail.com",
            password: this.userService.getHashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id,
          },
          {
            name: "I'm Hỏi Dân IT",
            email: "hoidanit@gmail.com",
            password: this.userService.getHashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 96,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id,
          },
          {
            name: "I'm normal user",
            email: "user@gmail.com",
            password: this.userService.getHashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: userRole?._id,
          },
        ]);
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        // this.logger.log(">>> ALREADY INIT SAMPLE DATA...");
        console.log(">>> ALREADY INIT SAMPLE DATA...");
      }
    }
  }

}
