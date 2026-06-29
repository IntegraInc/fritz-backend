import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { SeniorService } from '../senior/senior.service';
import ProductResponse, {
  ProductServiceResponse,
} from './types/ProductResponse';
import PromotionRequest from './types/PromotionRequest';
import PromotionProductsSeniorArray, {
  PromotionProductsApi,
  PromotionProductsApiArray,
} from './types/Promotion';
import DeletePromotionRequest from './types/DeletePromotion';

type ProductParameters = {
  username: string;
  password: string;
  company: string;
  family: string;
  page: number;
  searchParameters: string;
  recordsPerPage: number;
};
@Injectable()
export class ProductsService {
  constructor(private readonly seniorService: SeniorService) {}
  async getProducts({
    username,
    password,
    company,
    family,
    page,
    searchParameters,
    recordsPerPage,
  }: ProductParameters): Promise<ProductServiceResponse> {
    const response = await this.seniorService.getProducts({
      username: username,
      password: password,
      company: company,
      family: family,
      page: page,
      searchParameters: searchParameters,
      recordsPerPage: recordsPerPage,
    });

    return {
      totalPages: response.totalPages || 1,
      totalRecords: response.totalRecords || 0,
      products: response.products.map((product) => ({
        code: product.codpro,
        description: product.despro,
        average: Number(product.medpon),
        icms: Number(product.perIcm),
        externalComission: Number(product.percoe),
        internalComission: Number(product.percoi),
        freight: Number(product.perfre),
        ipi: Number(product.peripi),
        profit: Number(product.perluc),
        pis: Number(product.perpis),
        cofins: Number(product.percof),
        familyCode: Number(product.codfam),
        familyDescription: product.desfam,
        inboundIcms: Number(product.pericment),
        inboundCofinsAndPis: Number(product.perpicofent),
        inboundIpi: Number(product.peripient),
        inboundFreight: Number(product.perfreent),
        fixedCoast: Number(product.cusfix),
        basePrice: Number(product.prebas),
        lastInboundPrice: Number(product.vlruen),
        lastInboundDate: product.datuen,
        lastUpdateDate: product.datalt,
        lastUpdateTime: product.horalt,
        lastUpdateUser: product.usualt,
      })),
    };
  }
  async putProducts({
    username,
    password,
    company,
    products,
  }: {
    username: string;
    password: string;
    company: string;
    products: ProductResponse[];
  }) {
    try {
      if (!products?.length) {
        throw new BadRequestException('Nenhum produto informado');
      }

      const seniorProducts = products.map((product) => ({
        code: product.code || '',
        description: product.description || '',
        average: product.average || 0,
        icms: product.icms || 0,
        externalComission: product.externalComission || 0,
        internalComission: product.internalComission || 0,
        freight: product.freight || 0,
        ipi: product.ipi || 0,
        profit: product.profit || 0,
        pis: product.pis || 0,
        cofins: product.cofins || 0,
        familyCode: product.familyCode || 0,
        familyDescription: product.familyDescription || '',
        inboundIcms: product.inboundIcms || 0,
        inboundCofinsAndPis: product.inboundCofinsAndPis || 0,
        inboundIpi: product.inboundIpi || 0,
        inboundFreight: product.inboundFreight || 0,
        fixedCoast: product.fixedCoast || 0,
      }));

      const response = await this.seniorService.putProducts({
        username,
        password,
        company,
        products: seniorProducts,
      });

      if (!response.products?.length) {
        throw new BadRequestException('' + response.erroExecucao);
      }

      return {
        message: 'Produtos alterados com sucesso',
        products: response.products.map((product) => ({
          code: product.codpro,
          description: product.despro,
          average: Number(product.medpon),
          icms: Number(product.perIcm),
          externalComission: Number(product.percoe),
          internalComission: Number(product.percoi),
          freight: Number(product.perfre),
          ipi: Number(product.peripi),
          profit: Number(product.perluc),
          pis: Number(product.perpis),
          cofins: Number(product.percof),
          inboundIcms: Number(product.pericment),
          inboundCofinsAndPis: Number(product.perpicofent),
          inboundIpi: Number(product.peripient),
          inboundFreight: Number(product.perfreent),
          fixedCoast: Number(product.cusfix),
          lastUpdateDate: product.datalt,
          lastUpdateTime: product.horalt,
          lastUpdateUser: product.usualt,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Erro ao alterar produtos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
  async postSimulationPromotion({
    username,
    password,
    company,
    tablePrice,
    initialDate,
    products,
  }: {
    username: string;
    password: string;
    company: string;
    tablePrice: string;
    initialDate: string;
    products: PromotionRequest[];
  }) {
    try {
      if (!products?.length) {
        throw new BadRequestException('Nenhum produto informado');
      }

      const seniorProducts = products.map((product) => ({
        code: product.code || '',
        average: product.average || 0,
        icms: product.icms || 0,
        externalComission: product.externalComission || 0,
        internalComission: product.internalComission || 0,
        freight: product.freight || 0,
        ipi: product.ipi || 0,
        profit: product.profit || 0,
        pis: product.pis || 0,
        cofins: product.cofins || 0,
        inboundIcms: product.inboundIcms || 0,
        inboundCofinsAndPis: product.inboundCofinsAndPis || 0,
        inboundIpi: product.inboundIpi || 0,
        inboundFreight: product.inboundFreight || 0,
        fixedCoast: product.fixedCoast || 0,
        basePrice: product.basePrice || 0,
      }));

      const response = await this.seniorService.postSimulationPromotion({
        username,
        password,
        company,
        tablePrice,
        initialDate,
        products: seniorProducts,
      });
      console.log(response);

      if (response.retorno !== 'OK') {
        throw new BadRequestException('' + response.erroExecucao);
      }

      return {
        message: 'Promoção simulada com sucesso',
        products: seniorProducts,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Erro ao criar simulação de produtos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
  async assignPromotion({
    username,
    password,
    company,
    tablePrice,
    initialDate,
    products,
  }: {
    username: string;
    password: string;
    company: string;
    tablePrice: string;
    initialDate: string;
    products: PromotionRequest[];
  }) {
    try {
      if (!products?.length) {
        throw new BadRequestException('Nenhum produto informado');
      }

      const seniorProducts = products.map((product) => ({
        code: product.code || '',
        average: product.average || 0,
        icms: product.icms || 0,
        externalComission: product.externalComission || 0,
        internalComission: product.internalComission || 0,
        freight: product.freight || 0,
        ipi: product.ipi || 0,
        profit: product.profit || 0,
        pis: product.pis || 0,
        cofins: product.cofins || 0,
        inboundIcms: product.inboundIcms || 0,
        inboundCofinsAndPis: product.inboundCofinsAndPis || 0,
        inboundIpi: product.inboundIpi || 0,
        inboundFreight: product.inboundFreight || 0,
        fixedCoast: product.fixedCoast || 0,
        basePrice: product.basePrice || 0,
      }));

      const response = await this.seniorService.assignPromotion({
        username,
        password,
        company,
        tablePrice,
        initialDate,
        products: seniorProducts,
      });

      if (response.retorno !== 'OK') {
        throw new BadRequestException('' + response.erroExecucao);
      }

      return {
        message: 'Promoção efetivada com sucesso',
        products: seniorProducts,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Erro ao criar simulação de produtos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
  async getPromotions({
    username,
    password,
    company,
    family,
    tablePrice,
    initialDate,
    page,
    searchParameters,
    recordsPerPage,
  }: {
    username: string;
    password: string;
    company: string;
    family: string;
    tablePrice: string;
    initialDate: string;
    page: number;
    searchParameters: string;
    recordsPerPage: number;
  }): Promise<PromotionProductsApi> {
    const response = await this.seniorService.getPromotions({
      username: username,
      password: password,
      company: company,
      family: family,
      tablePrice: tablePrice,
      initialDate: initialDate,
      page: page,
      searchParameters: searchParameters,
      recordsPerPage: recordsPerPage,
    });

    return {
      totalPages: response.totalPaginas || 1,
      totalRecords: response.totalRegistros || 0,
      products: response.produtos.map(
        (product: PromotionProductsSeniorArray) => ({
          code: product.codpro,
          description: product.despro,
          average: Number(product.medpon),
          icms: Number(product.pericm),
          externalComission: Number(product.percoe),
          internalComission: Number(product.percoi),
          freight: Number(product.perfre),
          ipi: Number(product.peripi),
          profit: Number(product.perluc),
          pis: Number(product.perpis),
          cofins: Number(product.percof),
          familyCode: Number(product.codfam),
          familyDescription: product.desfam,
          inboundIcms: Number(product.icment),
          inboundCofinsAndPis: Number(product.pccent),
          inboundIpi: Number(product.ipient),
          inboundFreight: Number(product.freent),
          fixedCoast: Number(product.cusfix),
          basePrice: Number(product.prebas),
        }),
      ),
    };
  }
  async deletePromotion({
    username,
    password,
    company,
    tablePrice,
    initialDate,
    products,
  }: {
    username: string;
    password: string;
    company: string;
    tablePrice: string;
    initialDate: string;
    products: DeletePromotionRequest[];
  }) {
    try {
      if (!products?.length) {
        throw new BadRequestException('Nenhum produto informado');
      }

      const seniorProducts = products.map((product) => ({
        code: product.code || '',
      }));

      const response = await this.seniorService.deletePromotion({
        username,
        password,
        company,
        tablePrice,
        initialDate,
        products: seniorProducts,
      });

      if (response.retorno !== 'OK') {
        throw new BadRequestException('' + response.erroExecucao);
      }

      return {
        message: 'Promoção deletada com sucesso',
        products: seniorProducts,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException({
        message: 'Erro ao criar simulação de produtos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
