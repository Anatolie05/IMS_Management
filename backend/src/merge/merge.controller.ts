import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MergeService } from './merge.service';
import { CreateMergeDto } from './dto/create-merge.dto';
import { CurrentUser, CurrentUserData } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Merge')
@Controller('merge')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class MergeController {
  constructor(private readonly mergeService: MergeService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Create a new merge' })
  create(
    @Body() createMergeDto: CreateMergeDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.mergeService.create(createMergeDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active merges' })
  findAll() {
    return this.mergeService.findAll();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get complete merge history (including unmerged)' })
  getMergeHistory() {
    return this.mergeService.getMergeHistory();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific merge' })
  findOne(@Param('id') id: string) {
    return this.mergeService.findOne(id);
  }

  @Post(':id/unmerge')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Unmerge a merge' })
  unmerge(@Param('id') id: string) {
    return this.mergeService.unmerge(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a merge (Admin only, must be unmerged first)' })
  remove(@Param('id') id: string) {
    return this.mergeService.remove(id);
  }
}
