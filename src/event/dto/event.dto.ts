import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  tag: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsDateString()
  @IsNotEmpty()
  schedule: string;
  @IsNotEmpty()
  maxMembers: number;
  @IsString()
  @IsNotEmpty()
  eventType: string;
}

export class FindEventDto {
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsString()
  tag: string;
}
