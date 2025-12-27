import api from "@/lib/axios";

export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

class AddressService {
  /**
   * Busca todos os endereços do usuário
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get("/addresses");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      throw error;
    }
  }

  /**
   * Busca um endereço específico
   */
  async getAddressById(id: number): Promise<Address> {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      throw error;
    }
  }

  /**
   * Cria um novo endereço
   */
  async createAddress(data: CreateAddressDto): Promise<Address> {
    try {
      const response = await api.post("/addresses", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  /**
   * Atualiza um endereço existente
   */
  async updateAddress(id: number, data: UpdateAddressDto): Promise<Address> {
    try {
      const response = await api.patch(`/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }

  /**
   * Remove um endereço
   */
  async deleteAddress(id: number): Promise<void> {
    try {
      await api.delete(`/addresses/${id}`);
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      throw error;
    }
  }

  /**
   * Define um endereço como padrão
   */
  async setDefaultAddress(id: number): Promise<Address> {
    try {
      const response = await api.patch(`/addresses/${id}/set-default`);
      return response.data;
    } catch (error) {
      console.error("Erro ao definir endereço padrão:", error);
      throw error;
    }
  }

  /**
   * Busca endereço por CEP (ViaCEP)
   */
  async searchZipCode(zipCode: string): Promise<{
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
  }> {
    try {
      const cleanZip = zipCode.replace(/\D/g, "");
      const response = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error("CEP não encontrado");
      }
      
      return data;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
