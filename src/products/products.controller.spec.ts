import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const productsServiceMock = {
    getProducts: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
      ],
    }).compile();

    controller = moduleRef.get(ProductsController);
  });

  it('deve chamar o service passando usuário, senha e filtros', async () => {
    productsServiceMock.getProducts.mockResolvedValue([]);

    const user = {
      username: 'usuario',
      password: 'senha',
    };

    const body = {
      company: '1',
      page: 1,
      searchParameters: 'CABO',
      recordsPerPage: 20,
    };

    await controller.getProducts(user, body);

    expect(productsServiceMock.getProducts).toHaveBeenCalledWith({
      username: 'usuario',
      password: 'senha',
      company: '1',
      page: 1,
      searchParameters: 'CABO',
      recordsPerPage: 20,
    });
  });
});