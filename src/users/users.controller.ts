import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from '@/decorator/customize';
import { User as UserSche } from './schemas/user.schema';
import { IUser } from './users.interface';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('create a new user')
  async create(@Body() createDTO: CreateUserDto, @User() user: IUser) {
    // return this.usersService.create(createDTO);

    let newUser = await this.usersService.create(createDTO, user);
    return { _id: newUser._id, createdAt: newUser.createdAt };
  }

  @Patch()
  @ResponseMessage('update a user')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let UpdateUser = await this.usersService.update(updateUserDto, user);

    return UpdateUser;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Delete a user')
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.usersService.remove(_id, user);
  }

  // @Public()
  // de khong can jwt thi phai co public
  @Get(':id')
  @ResponseMessage('fetch by user id')
  async findOne(@Param('id') id: string) {
    const findUser = await this.usersService.findOne(id);
    return findUser;
  }

  @Get()
  @ResponseMessage('Fetch List User with paginate----')
  async findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.usersService.findAll(+currentPage, +limit, qs);
  }
}
