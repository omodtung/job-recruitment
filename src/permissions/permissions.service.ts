import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from '@/users/users.interface';
import * as wasi from 'node:wasi';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from '@/resumes/schemas/resumes.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permissions,
  PermissionsDocument,
} from '@/permissions/schema/permissions.schema';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permissions.name)
    private PermissonModel: SoftDeleteModel<PermissionsDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExist = await this.PermissonModel.findOne({ apiPath, method });

    if (isExist) {
      throw new BadRequestException(
        `permission voi apiPath =${apiPath} va method = ${method} da ton tai`,
      );
    }
    const newPermisson = await this.PermissonModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newPermisson?._id,
      createdAt: newPermisson?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;
    // let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.PermissonModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.PermissonModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(' no permission id is invalid.');
      // return this.PermissonModel.findOne(id);
    }
    return await this.PermissonModel.findById(id);
  }

  async update(
    _id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    const { name, apiPath, method, module } = updatePermissionDto;
    const updated = await this.PermissonModel.updateOne(
      { _id },
      {
        name,
        apiPath,
        method,
        module,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.PermissonModel.updateOne(
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

    return this.PermissonModel.softDelete({ _id: id });
  }
}
