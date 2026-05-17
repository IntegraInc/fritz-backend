import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

interface SearchProductsBody {
  company: string;
  filter?: string;
  page: number;
  limit: number;
}

interface AuthenticatedRequest extends Request {
  user: {
    username: string;
    password: string;
  };
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('search')
  searchProducts(
    @Req() req: AuthenticatedRequest,
    @Body() body: SearchProductsBody,
  ) {
    const { username, password } = req.user;

    return this.productsService.searchProducts({
      username,
      password,
      company: body.company,
      filter: body.filter,
      page: body.page,
      limit: body.limit,
    });
  }
}
