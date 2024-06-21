import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { ResponseMessage } from '@/decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Response } from 'express';
@Controller('stateless')
export class StatelessController {
  constructor(private statelessService: StatelessService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ResponseMessage('User login')
  // @Res({passthrough:true}) dong nay khi data duoc tra ve chi co server co the doc duoc
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.statelessService.login(req.user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getProfile(@Request() req) {
    delete req.user.password;
    return req.user;
  }

  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.statelessService.register(registerUserDto);
  }
}
