import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  location: string;
  @IsNotEmpty()
  @IsString()
  tag: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  eventName: string;
  @IsString()
  postLink: string;
  userId: number;
}
