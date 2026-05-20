import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiOperation({
    summary: 'Pesquisar produtos com base em parâmetros de busca e paginação',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company: { type: 'string', default: '1' },
        page: { type: 'number', default: 1 },
        searchParameters: {
          type: 'string',
          default: 'code, description or family',
        },
        recordsPerPage: { type: 'number', default: 50 },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('search')
  async getProducts(
    @CurrentUser() user: { username: string; password: string },
    @Body()
    body: {
      company: string;
      page: number;
      searchParameters: string;
      recordsPerPage: number;
    },
  ) {
    return this.productsService.getProducts({
      username: user.username,
      password: user.password,
      company: body.company,
      page: body.page,
      searchParameters: body.searchParameters,
      recordsPerPage: body.recordsPerPage,
    });
  }
}
