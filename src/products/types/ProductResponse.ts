import e from 'express';

export default interface ProductResponse {
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
  cofins?: number;
  familyCode: number;
  familyDescription: string;
  inboundIcms: number;
  inboundCofinsAndPis: number;
  inboundIpi: number;
  inboundFreight: number;
  fixedCoast: number;
  inboundInvoicePrice?: number;
  basePrice?: number;
  lastInboundPrice?: number;
  lastInboundDate?: string;
  lastUpdateDate?: string;
  lastUpdateTime?: string;
  lastUpdateUser?: string;
}

export type ProductServiceResponse = {
  totalPages: number;
  totalRecords: number;
  products: ProductResponse[];
};
