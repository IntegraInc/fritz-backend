export default interface DeletePromotionRequest {
  code: string;
}

export interface DeletePromotionResponse {
  retorno: string;
  erroExecucao?: string;
}
