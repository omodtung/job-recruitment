import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User as UserC } from '@/decorator/customize';
import { use } from 'passport';
import aqp from 'api-query-params';
// import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.userModel.count();
    if (count === 0) {
      const salt = genSaltSync(10);
      const hash = hashSync(
        this.configService.get<string>('INIT_USER_PASSWORD'),
        salt,
      );
      await this.userModel.insertMany([
        {
          name: 'Eric',
          email: 'admin@gmail.com',
          password: hash,
        },
        {
          name: 'User',
          email: 'user@gmail.com',
          password: hash,
        },
        {
          name: 'User 1',
          email: 'user1@gmail.com',
          password: hash,
        },
        {
          name: 'User 2',
          email: 'user2@gmail.com',
          password: hash,
        },
        {
          name: 'User 3',
          email: 'user3@gmail.com',
          password: hash,
        },
      ]);
    }
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createDTO: CreateUserDto, @UserC() user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createDTO;
    const hashPassword = this.getHashPassword(createDTO.password);

    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      // fix this for it can run
      // createdBy: {
      //   _id: user._id,
      //   email: user.email,
      // },
      // createdBy: {_id:user._id},
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    // return await this.userModel.find({});
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .select('-password')
      .populate(population)
      // dung population de join cac bang lai
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        totals: totalItems,
      },
      result,
    };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  checkPassword(hash: string, plain: string) {
    return compareSync(hash, plain);
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;

    return await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password');
  }

  async update(updateUserDto: UpdateUserDto, @UserC() user: IUser) {
    // return await this.userModel.updateOne(
    //   { _id: updateUserDto._id },
    //   { ...updateUserDto },
    // );
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        // fix this how it can run
        // updatedBy: {
        //   _id: user._id,
        //   email: user.email,
        // },
      },
    );
  }

  async remove(id: string, user: IUser) {
    // return this.userModel.softDelete({
    //   _id: id,
    // });
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found user`;
    await this.userModel.updateOne({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    // const checkExist = await this.userModel.findOne({ email });
    // if(checkExist)
    // {
    //   throw new BadRequestException(`the email ${email} is exist`)
    // }
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email: 'telecom21@gmail.com',
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });
    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string  ) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  async findUserByToken(refresh_token: string) {
    return await this.userModel.findOne({ refresh_token });
  }
}
