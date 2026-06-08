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
}

export type ProductServiceResponse = {
  totalPages: number;
  totalRecords: number;
  products: ProductResponse[];
};
