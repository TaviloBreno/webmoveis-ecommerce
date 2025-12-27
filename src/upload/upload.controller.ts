import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetPrimaryImageDto } from './dto/upload.dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product/:productId/image')
  @ApiOperation({ summary: 'Upload de imagem de produto' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'productId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        is_primary: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('is_primary') isPrimary?: string,
  ) {
    return this.uploadService.uploadProductImage(
      productId,
      file,
      isPrimary === 'true',
    );
  }

  @Post('product/:productId/images')
  @ApiOperation({ summary: 'Upload múltiplo de imagens' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'productId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.uploadService.uploadMultipleImages(productId, files);
  }

  @Patch('product/:productId/primary')
  @ApiOperation({ summary: 'Definir imagem principal' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'productId', type: Number })
  setPrimaryImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() setPrimaryDto: SetPrimaryImageDto,
  ) {
    return this.uploadService.setPrimaryImage(productId, setPrimaryDto.image_id);
  }

  @Get('product/:productId/images')
  @ApiOperation({ summary: 'Listar imagens de um produto' })
  @ApiParam({ name: 'productId', type: Number })
  getProductImages(@Param('productId', ParseIntPipe) productId: number) {
    return this.uploadService.getProductImages(productId);
  }

  @Delete('image/:imageId')
  @ApiOperation({ summary: 'Deletar imagem' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'imageId', type: Number })
  deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.uploadService.deleteImage(imageId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de armazenamento (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getStorageStats() {
    return this.uploadService.getStorageStats();
  }
}
