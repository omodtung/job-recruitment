import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: ' name khong duoc bo trong' })
  name: string;
  @IsNotEmpty({ message: 'api khong duoc bo trong' })
  apiPath: string;

  @IsNotEmpty({ message: 'method khong duoc bo trong' })
  method: string;
  @IsNotEmpty({ message: 'module khong duoc bo trong' })
  module: string;
}
