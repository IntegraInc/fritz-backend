import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import SeniorProduct from './types/Product';
import ProductResponse from './types/ProductResponse';
import PromotionRequest from './types/PromotionRequest';
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
        family: { type: 'string', default: '100' },
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
      family: string;
      searchParameters: string;
      recordsPerPage: number;
    },
  ) {
    return this.productsService.getProducts({
      username: user.username,
      password: user.password,
      company: body.company,
      page: body.page,
      family: body.family,
      searchParameters: body.searchParameters,
      recordsPerPage: body.recordsPerPage,
    });
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company: { type: 'string', default: '1' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', default: 'PROD001' },
              description: { type: 'string', default: 'Product 1' },
              average: { type: 'number', default: 10 },
              icms: { type: 'number', default: 18 },
              externalComission: { type: 'number', default: 5 },
              internalComission: { type: 'number', default: 3 },
              freight: { type: 'number', default: 2 },
              ipi: { type: 'number', default: 4 },
              profit: { type: 'number', default: 20 },
              pis: { type: 'number', default: 1 },
              cofins: { type: 'number', default: 2 },
              familyCode: { type: 'number', default: 100 },
              familyDescription: { type: 'string', default: 'Family 1' },
              inboundIcms: { type: 'number', default: 0 },
              inboundCofinsAndPis: { type: 'number', default: 0 },
              inboundIpi: { type: 'number', default: 0 },
              inboundFreight: { type: 'number', default: 0 },
              fixedCoast: { type: 'number', default: 0 },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Altera um ou mais produtos baseados em uma lista',
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', default: 'PROD001' },
              description: { type: 'string', default: 'Product 1' },
              average: { type: 'number', default: 10 },
              icms: { type: 'number', default: 18 },
              externalComission: { type: 'number', default: 5 },
              internalComission: { type: 'number', default: 3 },
              freight: { type: 'number', default: 2 },
              ipi: { type: 'number', default: 4 },
              profit: { type: 'number', default: 20 },
              pis: { type: 'number', default: 1 },
              cofins: { type: 'number', default: 2 },
              inboundIcms: { type: 'number', default: 0 },
              inboundCofinsAndPis: { type: 'number', default: 0 },
              inboundIpi: { type: 'number', default: 0 },
              inboundFreight: { type: 'number', default: 0 },
              fixedCoast: { type: 'number', default: 0 },
            },
          },
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  @HttpCode(HttpStatus.OK)
  async putProducts(
    @CurrentUser() user: { username: string; password: string },
    @Body()
    body: {
      company: string;
      products: ProductResponse[];
    },
  ) {
    return this.productsService.putProducts({
      username: user.username,
      password: user.password,
      company: body.company,
      products: body.products,
    });
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company: { type: 'string', default: '1' },
        tablePrice: { type: 'string', default: '001' },
        initialDate: { type: 'string', default: '29/05/2026' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', default: 'PROD001' },
              average: { type: 'number', default: 10 },
              icms: { type: 'number', default: 18 },
              externalComission: { type: 'number', default: 5 },
              internalComission: { type: 'number', default: 3 },
              freight: { type: 'number', default: 2 },
              ipi: { type: 'number', default: 4 },
              profit: { type: 'number', default: 20 },
              pis: { type: 'number', default: 1 },
              cofins: { type: 'number', default: 2 },
              inboundIcms: { type: 'number', default: 0 },
              inboundCofinsAndPis: { type: 'number', default: 0 },
              inboundIpi: { type: 'number', default: 0 },
              inboundFreight: { type: 'number', default: 0 },
              fixedCoast: { type: 'number', default: 0 },
              basePrice: { type: 'number', default: 0 },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Cria simulação de promoção',
  })
  // @ApiResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       products: {
  //         type: 'array',
  //         items: {
  //           type: 'object',
  //           properties: {
  //             code: { type: 'string', default: 'PROD001' },
  //             description: { type: 'string', default: 'Product 1' },
  //             average: { type: 'number', default: 10 },
  //             icms: { type: 'number', default: 18 },
  //             externalComission: { type: 'number', default: 5 },
  //             internalComission: { type: 'number', default: 3 },
  //             freight: { type: 'number', default: 2 },
  //             ipi: { type: 'number', default: 4 },
  //             profit: { type: 'number', default: 20 },
  //             pis: { type: 'number', default: 1 },
  //             cofins: { type: 'number', default: 2 },
  //             inboundIcms: { type: 'number', default: 0 },
  //             inboundCofinsAndPis: { type: 'number', default: 0 },
  //             inboundIpi: { type: 'number', default: 0 },
  //             inboundFreight: { type: 'number', default: 0 },
  //             fixedCoast: { type: 'number', default: 0 },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  @UseGuards(AuthGuard('jwt'))
  @Post('promotion')
  @HttpCode(HttpStatus.OK)
  async postPromotionSimulation(
    @CurrentUser() user: { username: string; password: string },
    @Body()
    body: {
      company: string;
      tablePrice: string;
      initialDate: string;
      products: PromotionRequest[];
    },
  ) {
    return this.productsService.postSimulationPromotion({
      username: user.username,
      password: user.password,
      company: body.company,
      tablePrice: body.tablePrice,
      initialDate: body.initialDate,
      products: body.products,
    });
  }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        company: { type: 'string', default: '1' },
        tablePrice: { type: 'string', default: '001' },
        initialDate: { type: 'string', default: '29/05/2026' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', default: 'PROD001' },
              average: { type: 'number', default: 10 },
              icms: { type: 'number', default: 18 },
              externalComission: { type: 'number', default: 5 },
              internalComission: { type: 'number', default: 3 },
              freight: { type: 'number', default: 2 },
              ipi: { type: 'number', default: 4 },
              profit: { type: 'number', default: 20 },
              pis: { type: 'number', default: 1 },
              cofins: { type: 'number', default: 2 },
              inboundIcms: { type: 'number', default: 0 },
              inboundCofinsAndPis: { type: 'number', default: 0 },
              inboundIpi: { type: 'number', default: 0 },
              inboundFreight: { type: 'number', default: 0 },
              fixedCoast: { type: 'number', default: 0 },
              basePrice: { type: 'number', default: 0 },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Efetiva a promoção simulada',
  })
  // @ApiResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       products: {
  //         type: 'array',
  //         items: {
  //           type: 'object',
  //           properties: {
  //             code: { type: 'string', default: 'PROD001' },
  //             description: { type: 'string', default: 'Product 1' },
  //             average: { type: 'number', default: 10 },
  //             icms: { type: 'number', default: 18 },
  //             externalComission: { type: 'number', default: 5 },
  //             internalComission: { type: 'number', default: 3 },
  //             freight: { type: 'number', default: 2 },
  //             ipi: { type: 'number', default: 4 },
  //             profit: { type: 'number', default: 20 },
  //             pis: { type: 'number', default: 1 },
  //             cofins: { type: 'number', default: 2 },
  //             inboundIcms: { type: 'number', default: 0 },
  //             inboundCofinsAndPis: { type: 'number', default: 0 },
  //             inboundIpi: { type: 'number', default: 0 },
  //             inboundFreight: { type: 'number', default: 0 },
  //             fixedCoast: { type: 'number', default: 0 },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  @UseGuards(AuthGuard('jwt'))
  @Post('assignment')
  @HttpCode(HttpStatus.OK)
  async postAssignPromotion(
    @CurrentUser() user: { username: string; password: string },
    @Body()
    body: {
      company: string;
      tablePrice: string;
      initialDate: string;
      products: PromotionRequest[];
    },
  ) {
    return this.productsService.assignPromotion({
      username: user.username,
      password: user.password,
      company: body.company,
      tablePrice: body.tablePrice,
      initialDate: body.initialDate,
      products: body.products,
    });
  }
}
