import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalIMS,
      totalAnalysts,
      totalTags,
      totalMerges,
      statusCounts,
      priorityCounts,
      recentIMS,
      unassignedIMS,
      imsByAnalyst,
      topTags,
    ] = await Promise.all([
      // Total IMS count (excluding deleted)
      this.prisma.iMS.count({
        where: { deletedAt: null },
      }),

      // Total analysts
      this.prisma.user.count({
        where: { role: 'ANALYST' },
      }),

      // Total tags
      this.prisma.tag.count(),

      // Total active merges
      this.prisma.mergedIMS.count({
        where: { unmergedAt: null },
      }),

      // IMS by status
      this.prisma.iMS.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: true,
      }),

      // IMS by priority
      this.prisma.iMS.groupBy({
        by: ['priority'],
        where: { deletedAt: null },
        _count: true,
      }),

      // Recent IMS (last 10)
      this.prisma.iMS.findMany({
        where: { deletedAt: null },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          ccdId: true,
          reportName: true,
          status: true,
          priority: true,
          createdAt: true,
          analyst: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),

      // Unassigned IMS count
      this.prisma.iMS.count({
        where: {
          deletedAt: null,
          analystId: null,
        },
      }),

      // IMS by analyst
      this.prisma.user.findMany({
        where: { role: 'ANALYST' },
        select: {
          id: true,
          fullName: true,
          email: true,
          _count: {
            select: {
              assignedIMS: {
                where: { deletedAt: null },
              },
            },
          },
        },
        orderBy: {
          assignedIMS: {
            _count: 'desc',
          },
        },
      }),

      // Top 10 tags by usage
      this.prisma.tag.findMany({
        take: 10,
        orderBy: {
          ims: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          name: true,
          color: true,
          _count: {
            select: {
              ims: true,
            },
          },
        },
      }),
    ]);

    return {
      overview: {
        totalIMS,
        totalAnalysts,
        totalTags,
        totalMerges,
        unassignedIMS,
      },
      statusDistribution: statusCounts.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      priorityDistribution: priorityCounts.map((item) => ({
        priority: item.priority,
        count: item._count,
      })),
      recentIMS,
      analystWorkload: imsByAnalyst.map((analyst) => ({
        id: analyst.id,
        fullName: analyst.fullName,
        email: analyst.email,
        activeIMS: analyst._count.assignedIMS,
      })),
      topTags: topTags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        usage: tag._count.ims,
      })),
    };
  }

  async getAnalystStats(analystId: string) {
    const [totalAssigned, statusCounts, recentActivity, completionRate] =
      await Promise.all([
        // Total IMS assigned
        this.prisma.iMS.count({
          where: {
            analystId,
            deletedAt: null,
          },
        }),

        // IMS by status for this analyst
        this.prisma.iMS.groupBy({
          by: ['status'],
          where: {
            analystId,
            deletedAt: null,
          },
          _count: true,
        }),

        // Recent IMS activity
        this.prisma.iMS.findMany({
          where: {
            analystId,
            deletedAt: null,
          },
          take: 10,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            ccdId: true,
            reportName: true,
            status: true,
            priority: true,
            updatedAt: true,
          },
        }),

        // Completion rate
        this.prisma.iMS.count({
          where: {
            analystId,
            status: 'COMPLETED',
            deletedAt: null,
          },
        }),
      ]);

    return {
      totalAssigned,
      statusDistribution: statusCounts.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      recentActivity,
      completionRate:
        totalAssigned > 0 ? (completionRate / totalAssigned) * 100 : 0,
    };
  }

  async getTimeline(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const imsCreated = await this.prisma.iMS.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
        deletedAt: null,
      },
      _count: true,
    });

    return {
      period: `Last ${days} days`,
      data: imsCreated.map((item) => ({
        date: item.createdAt,
        count: item._count,
      })),
    };
  }

  async getTrends() {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const [currentMonthCount, lastMonthCount, currentMonthCompleted, lastMonthCompleted] = await Promise.all([
      this.prisma.iMS.count({
        where: {
          createdAt: { gte: lastMonth },
          deletedAt: null,
        },
      }),
      this.prisma.iMS.count({
        where: {
          createdAt: { lt: lastMonth },
          deletedAt: null,
        },
      }),
      this.prisma.iMS.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: lastMonth },
          deletedAt: null,
        },
      }),
      this.prisma.iMS.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { lt: lastMonth },
          deletedAt: null,
        },
      }),
    ]);

    const creationTrend = lastMonthCount > 0
      ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
      : 0;

    const completionTrend = lastMonthCompleted > 0
      ? ((currentMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100
      : 0;

    return {
      creationTrend: {
        current: currentMonthCount,
        previous: lastMonthCount,
        percentageChange: creationTrend.toFixed(2),
      },
      completionTrend: {
        current: currentMonthCompleted,
        previous: lastMonthCompleted,
        percentageChange: completionTrend.toFixed(2),
      },
    };
  }
}
