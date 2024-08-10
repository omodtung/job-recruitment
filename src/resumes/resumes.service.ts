import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from '@/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resumes.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private ResumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    // url: string (url của cv)
    // companyId: string
    // jobId: string
    const { url, companyId, jobId } = createResumeDto;
    const { email, _id } = user;
    let newResume = await this.ResumeModel.create({
      email: user.email,
      userId: user._id,
      status: 'Pending',
      ...createResumeDto,
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    /*
    - email (lấy từ req.user/jwt)
- userId (lấy từ req.user)
- status: “PENDING”
- history: [
{
status: "PENDING",
updatedAt: new Date,
updatedBy: {
_id: user._id,
email: user.email
}
}
]
]
- createdBy: { _id, email} //lấy từ req.user*/

    return {
      _id: newResume?._id,
      createdAt: newResume?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;
    // let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.ResumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.ResumeModel.find(filter)
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

  async findOne(_id: string) {
    return await this.ResumeModel.findOne({ _id });
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found resume');
    }

    const updated = await this.ResumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        //toan tu day them  data vao data current
        //day them phan tu vao array
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return ' not Found';

    await this.ResumeModel.updateOne(
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

    return this.ResumeModel.softDelete({ _id: _id });
  }
// api fetch resume - by -user=>populate companyId, jobId
  async findByUser(user: IUser) {
    return await this.ResumeModel.find({
      userId: user._id,
    })
      .sort('-createdAt')
      .populate([
        { path: 'companyId', select: { name: 1 } },
        {
          path: 'jobId',
          select: { name: 1 },
        },
      ]);
  }
}
