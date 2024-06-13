import { Injectable, OnModuleInit, Query } from "@nestjs/common";
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from '@/users/users.interface';
import aqp from 'api-query-params';
import { use } from 'passport';
import { isEmpty } from "rxjs";

@Injectable()
export class CompaniesService implements OnModuleInit {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    return 'hello';
  }

  // async create(createCompanyDto: CreateCompanyDto) {
  //   const company = await this.companyModel.create({
  //     name: createCompanyDto.name,
  //     address: createCompanyDto.address,
  //     description: createCompanyDto.description,
  //   });
  //   return company;
  // }

  // method 2
  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    console.log(user);
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
 async findAll(currentPage :number , limit:number ,qs: string ) {

    // @ts-ignore
    const { ﬁlter,sort , projection, population } = aqp(qs);

    // let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(ﬁlter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.companyModel.find(ﬁlter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
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
     result
   };
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },

      {
        $set: {
          ...updateCompanyDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.companyModel.softDelete({ _id: id });
  }
}
