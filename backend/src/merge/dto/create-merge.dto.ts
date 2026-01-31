import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, ArrayMinSize } from 'class-validator';

export class CreateMergeDto {
  @ApiProperty({ example: 'Merged Russian Disinformation Campaign' })
  @IsString()
  @IsNotEmpty()
  mergeName: string;

  @ApiProperty({
    example: 'Combined analysis of related IMS reports',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'These IMS are related and share common indicators',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    description: 'Array of IMS IDs to merge',
  })
  @IsUUID('4', { each: true })
  @ArrayMinSize(2, { message: 'At least 2 IMS are required for merge' })
  imsIds: string[];
}
