type DueDatesSenior = {
  datini: string;
  datfim: string;
};

type PromotionParameterSenior = {
  codtpr: string;
  vencimentos: DueDatesSenior | DueDatesSenior[];
};

export type PromotionParametersSenior = PromotionParameterSenior[];

type DueDatesArray = {
  initialDate: string;
  finalDate: string;
};

type PromotionParametersArray = {
  tablePrice: string;
  dueDates: DueDatesArray[];
};

export type PromotionParametersApi = {
  response: PromotionParametersArray[];
};
