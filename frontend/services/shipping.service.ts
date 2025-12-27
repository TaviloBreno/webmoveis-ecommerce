import api from "@/lib/api";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number; // em dias
  carrier: string;
}

export interface CalculateShippingDto {
  zipCode: string;
  items?: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface ShippingCalculationResult {
  options: ShippingOption[];
  zipCode: string;
}

class ShippingService {
  /**
   * Calcula opções de frete disponíveis
   */
  async calculateShipping(data: CalculateShippingDto): Promise<ShippingCalculationResult> {
    try {
      const response = await api.post("/shipping/calculate", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      
      // Fallback: retorna opções mockadas se a API falhar
      return this.getMockShippingOptions(data.zipCode);
    }
  }

  /**
   * Opções de frete mockadas para desenvolvimento/fallback
   */
  private getMockShippingOptions(zipCode: string): ShippingCalculationResult {
    const cleanZip = zipCode.replace(/\D/g, "");
    const basePrice = 15;
    
    // Simula preço baseado no CEP (distância)
    const firstDigit = parseInt(cleanZip[0] || "0");
    const distanceFactor = firstDigit * 2;

    return {
      zipCode: cleanZip,
      options: [
        {
          id: "pac",
          name: "PAC",
          description: "Entrega econômica dos Correios",
          price: basePrice + distanceFactor,
          deliveryTime: 10 + firstDigit,
          carrier: "Correios",
        },
        {
          id: "sedex",
          name: "SEDEX",
          description: "Entrega expressa dos Correios",
          price: (basePrice + distanceFactor) * 2.5,
          deliveryTime: 3 + Math.floor(firstDigit / 2),
          carrier: "Correios",
        },
        {
          id: "express",
          name: "Entrega Expressa",
          description: "Entrega rápida em até 24h",
          price: (basePrice + distanceFactor) * 4,
          deliveryTime: 1,
          carrier: "WebMóveis Express",
        },
      ],
    };
  }

  /**
   * Valida CEP brasileiro
   */
  validateZipCode(zipCode: string): boolean {
    const cleanZip = zipCode.replace(/\D/g, "");
    return /^\d{8}$/.test(cleanZip);
  }

  /**
   * Formata CEP para exibição (12345-678)
   */
  formatZipCode(zipCode: string): string {
    const cleanZip = zipCode.replace(/\D/g, "");
    if (cleanZip.length === 8) {
      return `${cleanZip.slice(0, 5)}-${cleanZip.slice(5)}`;
    }
    return zipCode;
  }

  /**
   * Estima prazo de entrega baseado na data atual
   */
  estimateDeliveryDate(deliveryTime: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + deliveryTime);
    
    // Pula fins de semana
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }

  /**
   * Formata data de entrega para exibição
   */
  formatDeliveryDate(deliveryTime: number): string {
    const date = this.estimateDeliveryDate(deliveryTime);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
}

export const shippingService = new ShippingService();
