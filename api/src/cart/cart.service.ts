import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtém ou cria um carrinho para o usuário
  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
                category: true,
                store: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { is_primary: true },
                    take: 1,
                  },
                  category: true,
                  store: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  // Calcula o total do carrinho
  private calculateCartTotal(cart: any) {
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  // Obtém o carrinho do usuário
  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    const total = this.calculateCartTotal(cart);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      total,
      item_count: itemCount,
    };
  }

  // Adiciona um produto ao carrinho
  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const { product_id, quantity } = addToCartDto;

    // Verifica se o produto existe e tem estoque
    const product = await this.prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${product.stock}`,
      );
    }

    // Obtém ou cria o carrinho
    const cart = await this.getOrCreateCart(userId);

    // Verifica se o item já existe no carrinho
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: product_id,
        },
      },
    });

    if (existingItem) {
      // Atualiza a quantidade
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Estoque insuficiente. Disponível: ${product.stock}, no carrinho: ${existingItem.quantity}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Cria novo item no carrinho
      await this.prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: product_id,
          quantity: quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  // Atualiza a quantidade de um item no carrinho
  async updateCartItem(
    userId: number,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    // Obtém o carrinho do usuário
    const cart = await this.getOrCreateCart(userId);

    // Verifica se o item pertence ao carrinho do usuário
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    // Verifica o estoque
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${cartItem.product.stock}`,
      );
    }

    // Atualiza a quantidade
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  // Remove um item do carrinho
  async removeFromCart(userId: number, itemId: number) {
    // Obtém o carrinho do usuário
    const cart = await this.getOrCreateCart(userId);

    // Verifica se o item pertence ao carrinho do usuário
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    // Remove o item
    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  // Limpa o carrinho
  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return this.getCart(userId);
  }

  // Obtém a contagem de itens no carrinho
  async getCartItemCount(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const count = await this.prisma.cartItem.aggregate({
      where: { cart_id: cart.id },
      _sum: {
        quantity: true,
      },
    });

    return {
      item_count: count._sum.quantity || 0,
    };
  }
}
