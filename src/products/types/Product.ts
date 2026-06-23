import ProductResponse from './ProductResponse';

export default interface SeniorProduct {
  codpro: string;
  despro: string;
  medpon: number;
  perIcm: number;
  percoe: number;
  percof: number;
  percoi: number;
  perfre: number;
  peripi: number;
  perluc: number;
  perpis: number;
  codfam: number;
  desfam: string;
  pericment: number;
  perpicofent: number;
  peripient: number;
  perfreent: number;
  cusfix: number;
  prebas: number;
  vlruen: number;
  datuen: string;
  datalt: string;
  horalt: string;
  usualt: string;
}

export type SeniorProductResponse = {
  totalPages?: number;
  products: SeniorProduct[];
  totalRecords?: number;
  erroExecucao?: string;
};
