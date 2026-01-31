import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });

    if (existingTag) {
      throw new ConflictException('Tag with this name already exists');
    }

    return this.prisma.tag.create({
      data: createTagDto,
      include: {
        _count: {
          select: {
            ims: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            ims: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        ims: {
          include: {
            ims: {
              select: {
                id: true,
                ccdId: true,
                reportName: true,
                status: true,
                priority: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            ims: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    await this.findOne(id);

    if (updateTagDto.name) {
      const existingTag = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name },
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('Tag name already in use');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
      include: {
        _count: {
          select: {
            ims: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }

  async getPopularTags(limit: number = 10) {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            ims: true,
          },
        },
      },
      orderBy: {
        ims: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return tags;
  }
}
