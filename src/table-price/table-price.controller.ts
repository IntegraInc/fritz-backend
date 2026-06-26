import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TablePriceService } from './table-price.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Table Price')
@Controller('table-price')
export class TablePriceController {
  constructor(private readonly tablePriceService: TablePriceService) {}

  @ApiOperation({
    summary: 'Criar novas validades de promoção',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company: { type: 'string', default: '1' },
        tablePrice: { type: 'string', default: '100' },
        initialDate: { type: 'string', default: '26/06/2026' },
        finalDate: {
          type: 'string',
          default: '30/06/2026',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('create-table-price-validate')
  async postTablePriceValidate(
    @CurrentUser() user: { username: string; password: string },
    @Body()
    body: {
      company: string;
      tablePrice: string;
      initialDate: string;
      finalDate: string;
    },
  ) {
    return this.tablePriceService.postTablePriceValidation({
      username: user.username,
      password: user.password,
      company: body.company,
      tablePrice: body.tablePrice,
      initialDate: body.initialDate,
      finalDate: body.finalDate,
    });
  }
}
