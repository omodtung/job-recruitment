import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './passport/stateless.local.guard';
import { StatelessService } from './stateless.service';
import { JwtAuthGuard } from './passport/stateless.jwt.auth.guard';
import { ResponseMessage, User } from '@/decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Response, response } from 'express';
import cookieParser from 'cookie-parser';
import { Request as RequestExpress } from 'express';
// import { Request } from 'express';
import { IUser } from '@/users/users.interface';
// import { Request as Req1 } from 'express';
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

  //  flow run
  // header-> authController -> jwt strategy ( ham  giai ma    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ) ->  decorator/ customize ;

  //fix for this take data user back

  @ResponseMessage('Get user information')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @ResponseMessage('Get User by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: RequestExpress,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];
    return this.statelessService.processNewToken(refresh_token, response);
  }
}
