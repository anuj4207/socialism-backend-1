import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EventDto {
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
  address: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  date: string;
  @IsBoolean()
  @IsNotEmpty()
  eventType: boolean;
  @IsNotEmpty()
  maxMembers: number;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  state: string;
}

export class FindEventDto {
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  tag: string;
}
