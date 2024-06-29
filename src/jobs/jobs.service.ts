import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from '@/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/jobs.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async onModuleInit() {
    return '';
  }
  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name,
      skill,
      company,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
    } = createJobDto;
    let newJobs = await this.jobModel.create({
      name,
      skill,
      company,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newJobs?._id,
      createdAt: newJobs?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;
    // let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)

      .populate(population)
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

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    // return `This action updates a #${id} job`;
    const update = await this.jobModel.updateOne(
      { _id },
      {
        $set: {
          ...updateJobDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );
    return update;
  }

  async remove(_id: string, user: IUser) {
    // return `This action removes a #${id} job`;
    if (!mongoose.Types.ObjectId.isValid(_id)) return ' not Found';

    await this.jobModel.updateOne(
      {
        _id: _id,
      },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.jobModel.softDelete({ _id: _id });
  }
}
