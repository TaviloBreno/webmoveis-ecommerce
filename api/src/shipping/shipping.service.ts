import { Injectable, BadRequestException } from '@nestjs/common';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';

@Injectable()
export class ShippingService {
  calculateShipping(calculateShippingDto: CalculateShippingDto) {
    const { zip_code, weight, width, height, length } = calculateShippingDto;

    // Validação do CEP (formato brasileiro)
    const zipCodeRegex = /^\d{5}-?\d{3}$/;
    if (!zipCodeRegex.test(zip_code)) {
      throw new BadRequestException('Invalid zip code format. Use: 00000-000 or 00000000');
    }

    // Cálculo simples baseado em peso e dimensões
    // Em produção, você integraria com uma API real de frete (Correios, Melhor Envio, etc.)
    const volumetricWeight = (width * height * length) / 6000;
    const finalWeight = Math.max(weight, volumetricWeight);

    // Simulação de diferentes transportadoras
    const sedex = {
      name: 'SEDEX',
      price: this.calculatePrice(finalWeight, 15, 25),
      delivery_time: '2-4 dias úteis',
      carrier: 'Correios',
    };

    const pac = {
      name: 'PAC',
      price: this.calculatePrice(finalWeight, 10, 15),
      delivery_time: '5-10 dias úteis',
      carrier: 'Correios',
    };

    const express = {
      name: 'Expresso',
      price: this.calculatePrice(finalWeight, 20, 30),
      delivery_time: '1-2 dias úteis',
      carrier: 'Transportadora',
    };

    return {
      zip_code,
      weight: finalWeight,
      options: [sedex, pac, express],
    };
  }

  private calculatePrice(weight: number, baseCost: number, costPerKg: number): number {
    const price = baseCost + (weight * costPerKg);
    return Math.round(price * 100) / 100; // Arredonda para 2 casas decimais
  }
}
