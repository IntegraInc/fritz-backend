import { Injectable } from '@nestjs/common';
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
    const seniorProducts = products.map((product) => ({
      code: product.code,
      description: product.description,
      average: product.average,
      icms: product.icms,
      externalComission: product.externalComission,
      internalComission: product.internalComission,
      freight: product.freight,
      ipi: product.ipi,
      profit: product.profit,
      pis: product.pis,
      cofins: product.cofins,
    }));

    return this.seniorService.putProducts({
      username: username,
      password: password,
      company: company,
      products: seniorProducts,
    });
  }
}
