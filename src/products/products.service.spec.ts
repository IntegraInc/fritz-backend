// import { Test } from '@nestjs/testing';
// import { ProductsService } from './products.service';
// import { SeniorService } from '../senior/senior.service';

// describe('ProductsService', () => {
//   let service: ProductsService;

//   const seniorServiceMock = {
//     getProducts: jest.fn(),
//   };

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         ProductsService,
//         {
//           provide: SeniorService,
//           useValue: seniorServiceMock,
//         },
//       ],
//     }).compile();

//     service = moduleRef.get(ProductsService);
//   });

//   it('deve converter os produtos do Senior para o formato do frontend', async () => {
//     seniorServiceMock.getProducts.mockResolvedValue([
//       {
//         codpro: '001',
//         despro: 'Produto Teste',
//         medpon: 10,
//         pericm: 18,
//         percoe: 2,
//         percoi: 1,
//         perfre: 5,
//         peripi: 0,
//         perluc: 30,
//         perpis: 1.65,
//       },
//     ]);

//     const result = await service.getProducts({
//       username: 'admin',
//       password: '123',
//       company: '1',
//       page: 1,
//       searchParameters: '',
//       recordsPerPage: 20,
//     } as any);

//     expect(result).toEqual([
//       {
//         code: '001',
//         description: 'Produto Teste',
//         average: 10,
//         icms: 18,
//         externalComission: 2,
//         internalComission: 1,
//         freight: 5,
//         ipi: 0,
//         profit: 30,
//         pis: 1.65,
//       },
//     ]);
//   });
// });