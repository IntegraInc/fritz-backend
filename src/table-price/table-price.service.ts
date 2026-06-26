import { Injectable } from '@nestjs/common';
import { SeniorService } from '../senior/senior.service';
import { tablePriceRequest } from '../products/types/TablePrice';

@Injectable()
export class TablePriceService {
  constructor(private readonly seniorService: SeniorService) {}

  async postTablePriceValidation({
    username,
    password,
    company,
    tablePrice,
    initialDate,
    finalDate,
  }: tablePriceRequest): Promise<{}> {
    return await this.seniorService.postTablePriceValidate({
      username: username,
      password: password,
      company: company,
      tablePrice: tablePrice,
      initialDate: initialDate,
      finalDate: finalDate,
    });
  }
}
