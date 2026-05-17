import { Injectable } from '@nestjs/common';
import { SeniorService } from '../senior/senior.service';

export interface SearchProductsParams {
  username: string;
  password: string;
  company: string;
  filter?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ProductsService {
  constructor(private readonly seniorService: SeniorService) {}

  searchProducts(params: SearchProductsParams) {
    return this.seniorService.searchProducts(params);
  }
}
