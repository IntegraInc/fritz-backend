import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
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
