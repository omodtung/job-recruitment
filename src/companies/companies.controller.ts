import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { User } from "@/decorator/customize";
import { IUser } from "@/users/users.interface";
import { JwtAuthGuard } from "@/stateless/passport/stateless.jwt.auth.guard";

// import { IUser } from 'src/decorator/customize/u

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    console.log(user);

    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
