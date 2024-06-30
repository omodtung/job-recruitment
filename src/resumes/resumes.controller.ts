import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumesService.create(createResumeDto);
  }

  @Get()
  findAll() {
    return this.resumesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumesService.update(+id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(+id);
  }
}
