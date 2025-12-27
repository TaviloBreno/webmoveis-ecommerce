import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  // Garantir que o diretório de uploads existe
  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Validar arquivo
  validateFile(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Use: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    return true;
  }

  // Upload de imagem de produto
  async uploadProductImage(
    productId: number,
    file: Express.Multer.File,
    isPrimary = false,
  ) {
    this.validateFile(file);
    this.ensureUploadDir();

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Se for imagem principal, remover flag das outras
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { product_id: productId },
        data: { is_primary: false },
      });
    }

    // Salvar arquivo
    const fileName = `product_${productId}_${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // Criar registro no banco
    const image = await this.prisma.productImage.create({
      data: {
        product_id: productId,
        image_url: `/uploads/${fileName}`,
        is_primary: isPrimary,
      },
    });

    return {
      id: image.id,
      url: image.image_url,
      is_primary: image.is_primary,
      message: 'Imagem enviada com sucesso',
    };
  }

  // Upload múltiplo de imagens
  async uploadMultipleImages(productId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar todos os arquivos primeiro
    files.forEach((file) => this.validateFile(file));

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    this.ensureUploadDir();

    const uploadedImages: { id: number; url: string }[] = [];

    for (const file of files) {
      const fileName = `product_${productId}_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      const image = await this.prisma.productImage.create({
        data: {
          product_id: productId,
          image_url: `/uploads/${fileName}`,
          is_primary: false,
        },
      });

      uploadedImages.push({
        id: image.id,
        url: image.image_url,
      });
    }

    return {
      count: uploadedImages.length,
      images: uploadedImages,
      message: `${uploadedImages.length} imagens enviadas com sucesso`,
    };
  }

  // Definir imagem principal
  async setPrimaryImage(productId: number, imageId: number) {
    const image = await this.prisma.productImage.findFirst({
      where: {
        id: imageId,
        product_id: productId,
      },
    });

    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // Remover flag das outras imagens
    await this.prisma.productImage.updateMany({
      where: { product_id: productId },
      data: { is_primary: false },
    });

    // Definir nova imagem principal
    const updated = await this.prisma.productImage.update({
      where: { id: imageId },
      data: { is_primary: true },
    });

    return {
      id: updated.id,
      url: updated.image_url,
      is_primary: updated.is_primary,
      message: 'Imagem principal atualizada',
    };
  }

  // Deletar imagem
  async deleteImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // Deletar arquivo físico
    const filePath = path.join(process.cwd(), image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar registro
    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    return {
      message: 'Imagem deletada com sucesso',
    };
  }

  // Listar imagens de um produto
  async getProductImages(productId: number) {
    const images = await this.prisma.productImage.findMany({
      where: { product_id: productId },
      orderBy: [{ is_primary: 'desc' }, { created_at: 'asc' }],
    });

    return {
      product_id: productId,
      count: images.length,
      images,
    };
  }

  // Obter estatísticas de armazenamento
  async getStorageStats() {
    const totalImages = await this.prisma.productImage.count();
    
    let totalSize = 0;
    if (fs.existsSync(this.uploadDir)) {
      const files = fs.readdirSync(this.uploadDir);
      
      files.forEach((file) => {
        const filePath = path.join(this.uploadDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });
    }

    const productsWithImages = await this.prisma.product.count({
      where: {
        images: {
          some: {},
        },
      },
    });

    const productsWithoutImages = await this.prisma.product.count({
      where: {
        images: {
          none: {},
        },
      },
    });

    return {
      total_images: totalImages,
      total_size_bytes: totalSize,
      total_size_mb: (totalSize / 1024 / 1024).toFixed(2),
      products_with_images: productsWithImages,
      products_without_images: productsWithoutImages,
    };
  }
}
