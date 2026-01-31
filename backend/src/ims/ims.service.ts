import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIMSDto } from './dto/create-ims.dto';
import { UpdateIMSDto } from './dto/update-ims.dto';
import { FilterIMSDto } from './dto/filter-ims.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ImsService {
  constructor(private prisma: PrismaService) {}

  private async generateCCDId(): Promise<string> {
    const lastIMS = await this.prisma.iMS.findFirst({
      orderBy: { ccdId: 'desc' },
      select: { ccdId: true },
    });

    if (!lastIMS) {
      return 'CCD-1';
    }

    const lastNumber = parseInt(lastIMS.ccdId.replace('CCD-', ''));
    return `CCD-${lastNumber + 1}`;
  }

  async create(createIMSDto: CreateIMSDto, userId: string) {
    const { tagIds, ccdId: providedCcdId, ...data } = createIMSDto;
    const ccdId = providedCcdId || await this.generateCCDId();

    const ims = await this.prisma.iMS.create({
      data: {
        ...data,
        ccdId,
        createdById: userId,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        analyst: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Create history entry
    await this.prisma.iMSHistory.create({
      data: {
        imsId: ims.id,
        action: 'created',
        changes: JSON.stringify({ ccdId, ...data }),
      },
    });

    // Create assignment history if analyst is assigned
    if (createIMSDto.analystId) {
      await this.prisma.iMSAssignmentHistory.create({
        data: {
          imsId: ims.id,
          analystId: createIMSDto.analystId,
        },
      });
    }

    return ims;
  }

  async findAll(filterDto: FilterIMSDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.IMSWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { ccdId: { contains: search, mode: 'insensitive' } },
          { reportName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.analystId && { analystId: filters.analystId }),
      ...(filters.tagId && {
        tags: {
          some: {
            tagId: filters.tagId,
          },
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.iMS.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          analyst: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments2: true,
              attachments: true,
            },
          },
        },
      }),
      this.prisma.iMS.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const ims = await this.prisma.iMS.findFirst({
      where: { id, deletedAt: null },
      include: {
        analyst: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments2: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        attachments: true,
        relatedIMS: {
          include: {
            targetIMS: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                status: true,
              },
            },
          },
        },
        relatedFrom: {
          include: {
            sourceIMS: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                status: true,
              },
            },
          },
        },
        assignmentHistory: {
          include: {
            analyst: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: {
            assignedAt: 'desc',
          },
        },
      },
    });

    if (!ims) {
      throw new NotFoundException(`IMS with ID ${id} not found`);
    }

    return ims;
  }

  async update(id: string, updateIMSDto: UpdateIMSDto) {
    await this.findOne(id);

    const { tagIds, ...data } = updateIMSDto;
    const oldIMS = await this.prisma.iMS.findUnique({ where: { id } });

    // Track analyst change for history
    if (updateIMSDto.analystId && oldIMS?.analystId !== updateIMSDto.analystId) {
      await this.prisma.iMSAssignmentHistory.create({
        data: {
          imsId: id,
          analystId: updateIMSDto.analystId,
        },
      });
    }

    const ims = await this.prisma.iMS.update({
      where: { id },
      data: {
        ...data,
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        analyst: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Create history entry
    await this.prisma.iMSHistory.create({
      data: {
        imsId: id,
        action: 'updated',
        changes: JSON.stringify(updateIMSDto),
      },
    });

    return ims;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete
    await this.prisma.iMS.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.iMSHistory.create({
      data: {
        imsId: id,
        action: 'deleted',
        changes: JSON.stringify({ deletedAt: new Date() }),
      },
    });

    return { message: 'IMS deleted successfully' };
  }

  async restore(id: string) {
    const ims = await this.prisma.iMS.findUnique({
      where: { id },
    });

    if (!ims) {
      throw new NotFoundException(`IMS with ID ${id} not found`);
    }

    await this.prisma.iMS.update({
      where: { id },
      data: { deletedAt: null },
    });

    await this.prisma.iMSHistory.create({
      data: {
        imsId: id,
        action: 'restored',
        changes: JSON.stringify({ deletedAt: null }),
      },
    });

    return { message: 'IMS restored successfully' };
  }

  async getHistory(id: string) {
    await this.findOne(id);

    return this.prisma.iMSHistory.findMany({
      where: { imsId: id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
