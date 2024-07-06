import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto ,@User() user :IUser) {
    return this.rolesService.create(createRoleDto ,user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Role with Paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateRoleDto: UpdateRoleDto ,@User() user :IUser) {
    return this.rolesService.update(_id, updateRoleDto ,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string , @User() user :IUser) {
    return this.rolesService.remove(+id,user);
  }
}
