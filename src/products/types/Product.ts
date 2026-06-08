import ProductResponse from './ProductResponse';

export default interface SeniorProduct {
  codpro: string;
  despro: string;
  medpon: number;
  pericm: number;
  percoe: number;
  percof: number;
  percoi: number;
  perfre: number;
  peripi: number;
  perluc: number;
  perpis: number;
}

export type SeniorProductResponse = {
  totalPages?: number;
  products: SeniorProduct[];
  totalRecords?: number;
};
