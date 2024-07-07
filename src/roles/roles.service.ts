import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '@/users/users.interface';
import { create } from 'domain';
import { InjectModel } from '@nestjs/mongoose';
import { roles, rolesDocument } from './schemas/roles.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import MongoStore from 'connect-mongo';
import mongoose, { modelNames } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(roles.name)
    private rolesModel: SoftDeleteModel<rolesDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const isExist = await this.rolesModel.findOne({ name });
    if (isExist) {
      throw new BadGatewayException('Role Is Exist');
    }
    const newRole = await this.rolesModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;
    // let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.rolesModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.rolesModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)

      .populate(population)
      .select(projection as any)

      // dung population de join cac bang lai
      .exec();
    //   let { sort }= <{sort: any}>aqp(qs);
    //   let { sort }: {sort: any}= aqp(qs);
    // .sort(sort as any)

    // return `This action returns all HEHE companies`;
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
  // 
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found finding');
    }
    return (await this.rolesModel.findById(id)).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1 },
    });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    // return `This action updates a #${id} role`;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found finding');
    }
    const { name, description, isActive, permissions } = updateRoleDto;
    const isExist = await this.rolesModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`role  voi name = ${name} da ton tai`);
    }
    const updated = await this.rolesModel.updateOne(
      //this is id document or this document_id
      { _id: _id },
      {
        name,
        description,
        isActive,
        permissions,
        updatedBy: {
          id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(id: number, user: IUser) {
    const found = await this.rolesModel.findById(id);
    if (found.name === 'ADMIN') {
      throw new BadRequestException(' role Admin khong duoc xoa');
    }
    await this.rolesModel.updateOne(
      {
        _id: id,
      },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.rolesModel.softDelete({ _id: id });
  }
}
