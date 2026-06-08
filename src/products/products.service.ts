import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { SeniorService } from '../senior/senior.service';
import ProductResponse, {
  ProductServiceResponse,
} from './types/ProductResponse';

type ProductParameters = {
  username: string;
  password: string;
  company: string;
  family: string;
  page: number;
  searchParameters: string;
  recordsPerPage: number;
};
@Injectable()
export class ProductsService {
  constructor(private readonly seniorService: SeniorService) {}
  async getProducts({
    username,
    password,
    company,
    family,
    page,
    searchParameters,
    recordsPerPage,
  }: ProductParameters): Promise<ProductServiceResponse> {
    const response = await this.seniorService.getProducts({
      username: username,
      password: password,
      company: company,
      family: family,
      page: page,
      searchParameters: searchParameters,
      recordsPerPage: recordsPerPage,
    });

    return {
      totalPages: response.totalPages || 1,
      totalRecords: response.totalRecords || 0,
      products: response.products.map((product) => ({
        code: product.codpro,
        description: product.despro,
        average: Number(product.medpon),
        icms: Number(product.pericm),
        externalComission: Number(product.percoe),
        internalComission: Number(product.percoi),
        freight: Number(product.perfre),
        ipi: Number(product.peripi),
        profit: Number(product.perluc),
        pis: Number(product.perpis),
      })),
    };
  }
  async putProducts({
    username,
    password,
    company,
    products,
  }: {
    username: string;
    password: string;
    company: string;
    products: ProductResponse[];
  }) {
    try {
      if (!products?.length) {
        throw new BadRequestException('Nenhum produto informado');
      }

      const seniorProducts = products.map((product) => ({
        code: product.code || '',
        description: product.description || '',
        average: product.average || 0,
        icms: product.icms || 0,
        externalComission: product.externalComission || 0,
        internalComission: product.internalComission || 0,
        freight: product.freight || 0,
        ipi: product.ipi || 0,
        profit: product.profit || 0,
        pis: product.pis || 0,
        cofins: product.cofins || 0,
      }));

      const response = await this.seniorService.putProducts({
        username,
        password,
        company,
        products: seniorProducts,
      });

      if (!response.products?.length) {
        throw new BadRequestException('' + response.erroExecucao);
      }

      return {
        message: 'Produtos alterados com sucesso',
        products: response.products.map((product) => ({
          code: product.codpro,
          description: product.despro,
          average: Number(product.medpon),
          icms: Number(product.pericm),
          externalComission: Number(product.percoe),
          internalComission: Number(product.percoi),
          freight: Number(product.perfre),
          ipi: Number(product.peripi),
          profit: Number(product.perluc),
          pis: Number(product.perpis),
          cofins: Number(product.percof),
        })),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Erro ao alterar produtos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
