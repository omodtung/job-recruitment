import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  name: string;

  address: string;

  description: string;
}
