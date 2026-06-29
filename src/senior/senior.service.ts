import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import SeniorProduct, {
  SeniorProductResponse,
} from '../products/types/Product';
import ProductResponse from '../products/types/ProductResponse';
import PromotionRequest, {
  PromotionResponse,
} from '../products/types/PromotionRequest';
import PromotionProducts, {
  PromotionProductsSenior,
} from '../products/types/Promotion';
import PromotionProductsSeniorArray from '../products/types/Promotion';
import DeletePromotionRequest, {
  DeletePromotionResponse,
} from '../products/types/DeletePromotion';

@Injectable()
export class SeniorService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  private ensureArray<T>(data: T | T[] | undefined): T[] {
    if (!data) {
      return [];
    }

    return Array.isArray(data) ? data : [data];
  }
  async validateUser(username: string, password: string): Promise<boolean> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_AUTH_URL');

    // Implementation for user validation
    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:AuthenticateJAAS>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <pmUserName>${username}</pmUserName>
            <pmUserPassword>${password}</pmUserPassword>
         </parameters>
      </ser:AuthenticateJAAS>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);

    if (!match) {
      return false;
    }

    const pmLogged = Number(match[1]);

    return pmLogged === 0;
  }
  async getCompanies(username: string, password: string): Promise<string> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:buscaEmpresas>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
         </parameters>
      </ser:buscaEmpresas>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const empresas =
      parsed['S:Envelope']['S:Body']['ns2:buscaEmpresasResponse']['result'][
        'empresas'
      ];

    return empresas;
  }
  async getProducts({
    username,
    password,
    company,
    family,
    page,
    searchParameters,
    recordsPerPage,
  }: {
    username: string;
    password: string;
    company: string;
    family: string;
    page: number;
    searchParameters: string;
    recordsPerPage: number;
  }): Promise<SeniorProductResponse> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:buscaProdutos>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <!--Optional:-->
            <empresa>${company}</empresa>
            <!--Optional:-->
            <familia>${family || ''}</familia>
            <!--Optional:-->
            <pagina>${page}</pagina>
            <!--Optional:-->
            <parametroPesquisa>${searchParameters || ''}</parametroPesquisa>
            <!--Optional:-->
            <registrosPorPagina>${recordsPerPage}</registrosPorPagina>
         </parameters>
      </ser:buscaProdutos>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:buscaProdutosResponse']['result'];
    return {
      products: this.ensureArray<SeniorProduct>(
        result.produtos?.produto ?? result.produtos,
      ),
      totalPages: Number(result.totalPaginas ?? 0),
      totalRecords: Number(result.totalRegistros ?? 0),
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
  }): Promise<SeniorProductResponse> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');
    const productsXml = products.map(
      (product) => `
      <produtos>
        <codpro>${product.code}</codpro>
        <despro>${product.description}</despro>
        <medpon>${product.average}</medpon>
        <pericm>${product.icms}</pericm>
        <percoe>${product.externalComission}</percoe>
        <percof>${product.cofins}</percof>
        <percoi>${product.internalComission}</percoi>
        <perfre>${product.freight}</perfre>
        <peripi>${product.ipi}</peripi>
        <perluc>${product.profit}</perluc>
        <perpis>${product.pis}</perpis>
        <pericment>${product.inboundIcms}</pericment>
        <perpicofent>${product.inboundCofinsAndPis}</perpicofent>
        <peripient>${product.inboundIpi}</peripient>
        <perfreent>${product.inboundFreight}</perfreent>
        <cusfix>${product.fixedCoast}</cusfix>
      </produtos>
    `,
    );

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:alteraProdutos>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <empresa>${company}</empresa>
              ${productsXml}
         </parameters>
      </ser:alteraProdutos>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:alteraProdutosResponse']['result'];
    return {
      products: this.ensureArray<SeniorProduct>(
        result.produtos?.produto ?? result.produtos,
      ),
      erroExecucao: result.erroExecucao,
    };
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
  }): Promise<PromotionResponse> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');
    const productsXml = products.map(
      (product) => `
      <produtos>
        <codpro>${product.code}</codpro>
        <medpon>${product.average}</medpon>
        <pericm>${product.icms}</pericm>
        <percoe>${product.externalComission}</percoe>
        <percof>${product.cofins}</percof>
        <percoi>${product.internalComission}</percoi>
        <perfre>${product.freight}</perfre>
        <peripi>${product.ipi}</peripi>
        <perluc>${product.profit}</perluc>
        <perpis>${product.pis}</perpis>
        <cusfix>${product.fixedCoast}</cusfix>
        <icment>${product.inboundIcms}</icment>
        <ipient>${product.inboundIpi}</ipient>
        <pccent>${product.inboundCofinsAndPis}</pccent>
        <freent>${product.inboundFreight}</freent>
        <prebas>${product.basePrice}</prebas>
      </produtos>
    `,
    );

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:criarSimulacaoPromocao>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <codemp>${company}</codemp>
            <codtpr>${tablePrice}</codtpr>
            <datini>${initialDate}</datini>
              ${productsXml}
         </parameters>
      </ser:criarSimulacaoPromocao>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:criarSimulacaoPromocaoResponse'][
        'result'
      ];
    return {
      retorno: result.retorno,
      erroExecucao: result.erroExecucao,
    };
  }
  async postTablePriceValidate({
    username,
    password,
    company,
    tablePrice,
    initialDate,
    finalDate,
  }: {
    username: string;
    password: string;
    company: string;
    tablePrice: string;
    initialDate: string;
    finalDate: string;
  }): Promise<{}> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:criarValidadeTabelaPreco>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <codemp>${company}</codemp>
            <codtpr>${tablePrice}</codtpr>
            <datini>${initialDate}</datini>
            <datfim>${finalDate}</datfim>
         </parameters>
      </ser:criarValidadeTabelaPreco>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:criarValidadeTabelaPrecoResponse'][
        'result'
      ];
    return {
      retorno: result.retorno,
      erroExecucao: result.erroExecucao,
    };
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
  }): Promise<PromotionResponse> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');
    const productsXml = products.map(
      (product) => `
      <produtos>
        <codpro>${product.code}</codpro>
        <medpon>${product.average}</medpon>
        <pericm>${product.icms}</pericm>
        <percoe>${product.externalComission}</percoe>
        <percof>${product.cofins}</percof>
        <percoi>${product.internalComission}</percoi>
        <perfre>${product.freight}</perfre>
        <peripi>${product.ipi}</peripi>
        <perluc>${product.profit}</perluc>
        <perpis>${product.pis}</perpis>
        <cusfix>${product.fixedCoast}</cusfix>
        <icment>${product.inboundIcms}</icment>
        <ipient>${product.inboundIpi}</ipient>
        <pccent>${product.inboundCofinsAndPis}</pccent>
        <freent>${product.inboundFreight}</freent>
        <prebas>${product.basePrice}</prebas>
      </produtos>
    `,
    );

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:efetivaSimulacaoPromocao>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <codemp>${company}</codemp>
            <codtpr>${tablePrice}</codtpr>
            <datini>${initialDate}</datini>
              ${productsXml}
         </parameters>
      </ser:efetivaSimulacaoPromocao>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:efetivaSimulacaoPromocaoResponse'][
        'result'
      ];
    return {
      retorno: result.retorno,
      erroExecucao: result.erroExecucao,
    };
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
  }): Promise<PromotionProductsSenior> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:buscarSimulacaoPromocao>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <codemp>${company}</codemp>
            <codtpr>${tablePrice}</codtpr>
            <datini>${initialDate}</datini>
            <codfam>${family || ''}</codfam>
            <parametroPesquisa>${searchParameters || ''}</parametroPesquisa>
            <pagina>${page}</pagina>
            <registrosPorPagina>${recordsPerPage}</registrosPorPagina>
         </parameters>
      </ser:buscarSimulacaoPromocao>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:buscarSimulacaoPromocaoResponse'][
        'result'
      ];
    return {
      produtos: this.ensureArray<PromotionProductsSeniorArray>(
        result.produtos?.produto ?? result.produtos,
      ),
      totalPaginas: Number(result.totalPaginas ?? 0),
      totalRegistros: Number(result.totalRegistros ?? 0),
      erroExecucao: result.erroExecucao,
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
  }): Promise<DeletePromotionResponse> {
    const authUrl = this.configService.getOrThrow<string>('SENIOR_SOAP_URL');
    const productsXml = products.map(
      (product) => `
      <produtos>
        <codpro>${product.code}</codpro>
      </produtos>
    `,
    );

    // Implementation for user validation
    const xml = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:deletaSimulacaoPromocao>
         <user>${username}</user>
         <password>${password}</password>
         <encryption>0</encryption>
         <parameters>
            <codemp>${company}</codemp>
            <codtpr>${tablePrice}</codtpr>
            <datini>${initialDate}</datini>
              ${productsXml}
         </parameters>
      </ser:deletaSimulacaoPromocao>
   </soapenv:Body>
</soapenv:Envelope>
    `;
    const response = await firstValueFrom(
      this.httpService.post(authUrl, xml, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: '',
        },
      }),
    );
    const data = response.data as string;
    // const match = data.match(/<pmLogged>(.*?)<\/pmLogged>/);
    const parsed = await parseStringPromise(data, {
      explicitArray: false,
      ignoreAttrs: true,
    });

    const result =
      parsed['S:Envelope']['S:Body']['ns2:deletaSimulacaoPromocaoResponse'][
        'result'
      ];
    return {
      retorno: result.retorno,
      erroExecucao: result.erroExecucao,
    };
  }
}
