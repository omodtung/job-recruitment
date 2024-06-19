import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from '@/decorator/customize';
import { User as UserSche } from './schemas/user.schema';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('create a new user')
  async create(@Body() createDTO: CreateUserDto, @User() user: IUser) {
    // return this.usersService.create(createDTO);

    let newUser = await this.usersService.create(createDTO, user);
    return { _id: newUser._id, createdAt: newUser.createdAt };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('update a user')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let UpdateUser = await this.usersService.update(updateUserDto, user);

    return UpdateUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
