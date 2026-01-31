import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImsService } from './ims.service';
import { CreateIMSDto } from './dto/create-ims.dto';
import { UpdateIMSDto } from './dto/update-ims.dto';
import { FilterIMSDto } from './dto/filter-ims.dto';
import { CurrentUser, CurrentUserData } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('IMS')
@Controller('ims')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class ImsController {
  constructor(private readonly imsService: ImsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new IMS' })
  create(
    @Body() createIMSDto: CreateIMSDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.imsService.create(createIMSDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all IMS with filters' })
  findAll(@Query() filterDto: FilterIMSDto) {
    return this.imsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific IMS' })
  findOne(@Param('id') id: string) {
    return this.imsService.findOne(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get IMS history' })
  getHistory(@Param('id') id: string) {
    return this.imsService.getHistory(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an IMS' })
  update(@Param('id') id: string, @Body() updateIMSDto: UpdateIMSDto) {
    return this.imsService.update(id, updateIMSDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Delete (soft) an IMS' })
  remove(@Param('id') id: string) {
    return this.imsService.remove(id);
  }

  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted IMS (Admin only)' })
  restore(@Param('id') id: string) {
    return this.imsService.restore(id);
  }
}
