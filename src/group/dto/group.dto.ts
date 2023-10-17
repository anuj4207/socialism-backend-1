import { IsNotEmpty, IsString } from 'class-validator';

export class GroupDto {
  adminId: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  tag: string;
  @IsNotEmpty()
  @IsString()
  type: string;
}
