import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/users.interface';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Request, Response } from 'express';
@Injectable()
export class StatelessService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUserStateless(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) {
      return null;
    }
    const isValidPassword = this.usersService.checkPassword(
      pass,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async findUser(id: string): Promise<any> {
    const user = await this.usersService.findOne(id);

    return user;
  }

  async login(user: IUser, response: Response) {
    // const payload = { username: user.email, sub: user._id, name: user.name };

    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    console.log("test"+payload._id)

    const refresh_token = this.createRefreshToken(payload);
    // await this.usersService.
    await this.usersService.updateUserToken(refresh_token, _id);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }
  // return {
  //   access_token: this.jwtService.sign(payload)
  // };

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);
    return {
      // neu newUser = null thi khi tra ve se gap loi
      // ?. de tranh bi loi khi no null
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
    });
    return refreshToken;
  };
}
