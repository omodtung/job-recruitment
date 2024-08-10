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
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';
import { Public, ResponseMessage, User } from '@/decorator/customize';
import { IUser } from '@/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post/create From CreateResumeDto')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    console.log ('--------------------------------------------------------------------------------------------------------------------------------------------------------------------------')
    console.log(JSON.stringify(createResumeDto, null, 2));
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List resume with Paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }
  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.resumesService.findOne(_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Update from Resume ')
  async update(
    //lay id tu link url
    @Param('id') _id: string,
    //truy vet nguoi sua
    @User() user: IUser,
    //update only trang thai
    @Body('status') status: string,
  ) {
    return await this.resumesService.update(_id, status, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.resumesService.remove(_id, user);
  }

  @Post('by-user')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage(' Get Resume by user ')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }
}
