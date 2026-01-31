import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEnum,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { IMSStatus, PriorityLevel } from '@prisma/client';

export class CreateIMSDto {
  @ApiProperty({ example: 'CCD-1', required: false, description: 'Custom CCD ID. If not provided, will be auto-generated.' })
  @IsString()
  @IsOptional()
  ccdId?: string;

  @ApiProperty({ example: 'Russian Disinformation Campaign' })
  @IsString()
  @IsNotEmpty()
  reportName: string;

  @ApiProperty({ example: 'Detailed description of the IMS...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-01-15T10:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    example: 'https://opencti.example.com/report/123',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  linkOpenCTI?: string;

  @ApiProperty({
    example: 'https://docintel.example.com/doc/456',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  linkDocIntel?: string;

  @ApiProperty({ example: 'Additional comments...', required: false })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ enum: IMSStatus, example: IMSStatus.DRAFT, required: false })
  @IsEnum(IMSStatus)
  @IsOptional()
  status?: IMSStatus;

  @ApiProperty({
    enum: PriorityLevel,
    example: PriorityLevel.MEDIUM,
    required: false,
  })
  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @ApiProperty({ example: 'uuid-of-analyst', required: false })
  @IsUUID()
  @IsOptional()
  analystId?: string;

  @ApiProperty({ example: ['tag1-uuid', 'tag2-uuid'], required: false })
  @IsUUID('4', { each: true })
  @IsOptional()
  tagIds?: string[];
}
