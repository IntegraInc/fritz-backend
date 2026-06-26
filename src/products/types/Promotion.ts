export default interface PromotionProductsSeniorArray {
  codpro: string;
  despro: string;
  prebas: number;
  medpon: number;
  pericm: number;
  peripi: number;
  percof: number;
  perpis: number;
  perfre: number;
  percoi: number;
  percoe: number;
  perluc: number;
  cusfix: number;
  icment: number;
  pccent: number;
  ipient: number;
  freent: number;
  codfam: string;
  desfam: string;
}

export type PromotionProductsSenior = {
  produtos: PromotionProductsSeniorArray[];
  totalRegistros: number;
  totalPaginas: number;
  erroExecucao?: string;
};

export type PromotionProductsApiArray = {
  code: string;
  description: string;
  average: number;
  icms: number;
  externalComission: number;
  internalComission: number;
  freight: number;
  ipi: number;
  profit: number;
  pis: number;
  cofins: number;
  familyCode: number;
  familyDescription: string;
  inboundIcms: number;
  inboundCofinsAndPis: number;
  inboundIpi: number;
  inboundFreight: number;
  fixedCoast: number;
  basePrice: number;
};

export type PromotionProductsApi = {
  products: PromotionProductsApiArray[];
  totalRecords: number;
  totalPages: number;
  error?: string;
};
