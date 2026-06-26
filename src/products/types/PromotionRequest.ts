import e from 'express';

export default interface PromotionRequest {
  code: string;
  average: number;
  icms: number;
  externalComission: number;
  internalComission: number;
  freight: number;
  ipi: number;
  profit: number;
  pis: number;
  cofins: number;
  inboundIcms: number;
  inboundCofinsAndPis: number;
  inboundIpi: number;
  inboundFreight: number;
  fixedCoast: number;
  basePrice?: number;
}

export type PromotionResponse = {
  retorno: string;
  erroExecucao?: string;
};
