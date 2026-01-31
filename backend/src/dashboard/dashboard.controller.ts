import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Get('analyst/:id/stats')
  @ApiOperation({ summary: 'Get analyst-specific statistics' })
  getAnalystStats(@Param('id') id: string) {
    return this.dashboardService.getAnalystStats(id);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get IMS creation timeline' })
  getTimeline(@Query('days') days?: number) {
    return this.dashboardService.getTimeline(days ? parseInt(days.toString()) : 30);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get trends and analytics' })
  getTrends() {
    return this.dashboardService.getTrends();
  }
}
