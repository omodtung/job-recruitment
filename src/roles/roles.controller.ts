import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRoleDto: CreateRoleDto ,@User() user :IUser) {
    return this.rolesService.create(createRoleDto ,user);
  }

  @Get()
  @Public()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetch List Role with Paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') _id: string, @Body() updateRoleDto: UpdateRoleDto ,@User() user :IUser) {
    return this.rolesService.update(_id, updateRoleDto ,user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string , @User() user :IUser) {
    return this.rolesService.remove(+id,user);
  }
}
