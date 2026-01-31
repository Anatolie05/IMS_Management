import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString, IsInt, Min } from 'class-validator';
import { IMSStatus, PriorityLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterIMSDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: IMSStatus, required: false })
  @IsOptional()
  @IsEnum(IMSStatus)
  status?: IMSStatus;

  @ApiProperty({ enum: PriorityLevel, required: false })
  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  analystId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tagId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    enum: ['createdAt', 'updatedAt', 'date', 'ccdId'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
