import { Injectable } from '@nestjs/common';
import { SeniorService } from '../senior/senior.service';
import ProductResponse, {
  ProductServiceResponse,
} from './types/ProductResponse';

type ProductParameters = {
  username: string;
  password: string;
  company: string;
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
    page,
    searchParameters,
    recordsPerPage,
  }: ProductParameters): Promise<ProductServiceResponse> {
    const response = await this.seniorService.getProducts({
      username: username,
      password: password,
      company: company,
      page: page,
      searchParameters: searchParameters,
      recordsPerPage: recordsPerPage,
    });

    return {
      totalPages: response.totalPages,
      totalRecords: response.totalRecords,
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
}
