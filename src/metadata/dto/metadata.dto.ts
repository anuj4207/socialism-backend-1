import { IsNotEmpty, IsString } from 'class-validator';

export class MetadataDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  location: string;
}
