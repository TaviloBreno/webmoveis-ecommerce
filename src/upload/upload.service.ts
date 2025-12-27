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
      throw new BadRequestException('Produto não encontrado');
    }

    // Se marcar como primária, desmarcar outras
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { product_id: productId, is_primary: true },
        data: { is_primary: false },
      });
    }

    // Gerar URL da imagem
    const imageUrl = `/uploads/products/${file.filename}`;

    // Salvar no banco
    const productImage = await this.prisma.productImage.create({
      data: {
        product_id: productId,
        image_url: imageUrl,
        is_primary: isPrimary,
      },
    });

    return {
      id: productImage.id,
      url: imageUrl,
      is_primary: isPrimary,
      message: 'Imagem enviada com sucesso',
    };
  }

  // Upload múltiplo de imagens
  async uploadMultipleProductImages(
    files: Express.Multer.File[],
    productId: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    // Validar todos os arquivos
    files.forEach((file) => this.validateFile(file));

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    // Verificar se já existe imagem primária
    const existingPrimary = await this.prisma.productImage.findFirst({
      where: { product_id: productId, is_primary: true },
    });

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = `/uploads/products/${file.filename}`;
      const isPrimary = !existingPrimary && i === 0;

      const productImage = await this.prisma.productImage.create({
        data: {
          product_id: productId,
          image_url: imageUrl,
          is_primary: isPrimary,
        },
      });

      uploadedImages.push({
        id: productImage.id,
        url: imageUrl,
        is_primary: isPrimary,
      });
    }

    return {
      message: `${uploadedImages.length} imagens enviadas com sucesso`,
      images: uploadedImages,
    };
  }

  // Definir imagem primária
  async setPrimaryImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new BadRequestException('Imagem não encontrada');
    }

    // Desmarcar outras primárias do mesmo produto
    await this.prisma.productImage.updateMany({
      where: { product_id: image.product_id, is_primary: true },
      data: { is_primary: false },
    });

    // Marcar como primária
    const updatedImage = await this.prisma.productImage.update({
      where: { id: imageId },
      data: { is_primary: true },
    });

    return {
      message: 'Imagem principal atualizada',
      image: updatedImage,
    };
  }

  // Deletar imagem
  async deleteImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new BadRequestException('Imagem não encontrada');
    }

    // Deletar arquivo físico
    const filePath = path.join(process.cwd(), image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar do banco
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

    return images;
  }

  // Criar diretório de upload se não existir
  ensureUploadDirectoryExists() {
    const productsDir = path.join(this.uploadPath, 'products');

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }

    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }
  }
}
