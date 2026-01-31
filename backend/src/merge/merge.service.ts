import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMergeDto } from './dto/create-merge.dto';

@Injectable()
export class MergeService {
  constructor(private prisma: PrismaService) {}

  async create(createMergeDto: CreateMergeDto, userId: string) {
    const { imsIds, ...data } = createMergeDto;

    // Validate that all IMS exist and are not deleted
    const imsRecords = await this.prisma.iMS.findMany({
      where: {
        id: { in: imsIds },
        deletedAt: null,
      },
    });

    if (imsRecords.length !== imsIds.length) {
      throw new BadRequestException('Some IMS do not exist or have been deleted');
    }

    // Check if any IMS is already merged
    const alreadyMerged = await this.prisma.mergedIMSItem.findMany({
      where: {
        imsId: { in: imsIds },
        merge: {
          unmergedAt: null,
        },
      },
    });

    if (alreadyMerged.length > 0) {
      throw new BadRequestException('Some IMS are already part of another active merge');
    }

    // Create merge
    const merge = await this.prisma.mergedIMS.create({
      data: {
        ...data,
        createdById: userId,
        sourceIMS: {
          create: imsIds.map((imsId) => ({
            ims: { connect: { id: imsId } },
          })),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        sourceIMS: {
          include: {
            ims: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                status: true,
                description: true,
                analyst: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Update status of merged IMS to MERGED
    await this.prisma.iMS.updateMany({
      where: { id: { in: imsIds } },
      data: { status: 'MERGED' },
    });

    // Create history entries for each IMS
    await Promise.all(
      imsIds.map((imsId) =>
        this.prisma.iMSHistory.create({
          data: {
            imsId,
            action: 'merged',
            changes: JSON.stringify({
              mergeId: merge.id,
              mergeName: data.mergeName,
            }),
          },
        }),
      ),
    );

    return merge;
  }

  async findAll() {
    return this.prisma.mergedIMS.findMany({
      where: {
        unmergedAt: null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        sourceIMS: {
          include: {
            ims: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                status: true,
                priority: true,
              },
            },
          },
        },
        _count: {
          select: {
            sourceIMS: true,
          },
        },
      },
      orderBy: {
        mergedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const merge = await this.prisma.mergedIMS.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        sourceIMS: {
          include: {
            ims: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                description: true,
                status: true,
                priority: true,
                date: true,
                linkOpenCTI: true,
                linkDocIntel: true,
                comments: true,
                analyst: {
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
            },
          },
        },
      },
    });

    if (!merge) {
      throw new NotFoundException(`Merge with ID ${id} not found`);
    }

    return merge;
  }

  async unmerge(id: string) {
    const merge = await this.findOne(id);

    if (merge.unmergedAt) {
      throw new BadRequestException('This merge has already been unmerged');
    }

    // Update merge as unmerged
    const updatedMerge = await this.prisma.mergedIMS.update({
      where: { id },
      data: {
        unmergedAt: new Date(),
      },
      include: {
        sourceIMS: {
          include: {
            ims: true,
          },
        },
      },
    });

    // Update status of IMS back to IN_PROGRESS or their previous status
    const imsIds = updatedMerge.sourceIMS.map((item) => item.imsId);
    await this.prisma.iMS.updateMany({
      where: { id: { in: imsIds } },
      data: { status: 'IN_PROGRESS' },
    });

    // Create history entries
    await Promise.all(
      imsIds.map((imsId) =>
        this.prisma.iMSHistory.create({
          data: {
            imsId,
            action: 'unmerged',
            changes: JSON.stringify({
              mergeId: id,
              mergeName: merge.mergeName,
            }),
          },
        }),
      ),
    );

    return { message: 'Merge has been successfully unmerged', merge: updatedMerge };
  }

  async remove(id: string) {
    const merge = await this.findOne(id);

    if (!merge.unmergedAt) {
      throw new BadRequestException('Cannot delete an active merge. Unmerge it first.');
    }

    await this.prisma.mergedIMS.delete({
      where: { id },
    });

    return { message: 'Merge deleted successfully' };
  }

  async getMergeHistory() {
    return this.prisma.mergedIMS.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        sourceIMS: {
          include: {
            ims: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
              },
            },
          },
        },
        _count: {
          select: {
            sourceIMS: true,
          },
        },
      },
      orderBy: {
        mergedAt: 'desc',
      },
    });
  }
}
