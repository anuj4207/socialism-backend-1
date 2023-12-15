import { IsNotEmpty, IsString } from 'class-validator';

export class MetadataDto {
  @IsString()
  name: string;
  @IsString()
  about: string;
}
