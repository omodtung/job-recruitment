import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule  } from '@nestjs/mongoose';
import { JobSchema, Job } from './schemas/jobs.schema';
@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  
  ],
})
export class JobsModule {}
