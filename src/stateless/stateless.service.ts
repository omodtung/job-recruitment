import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/users.interface';

@Injectable()
export class StatelessService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: IUser) {
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
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
    // return {
    //   access_token: this.jwtService.sign(payload)
    // };
  }
}
