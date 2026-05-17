import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SearchProductsParams } from '../products/products.service';

@Injectable()
export class SeniorService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
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
  async searchProducts(params: SearchProductsParams) {
    const { username, password, company, filter, page, limit } = params;

    const authUrl = this.configService.getOrThrow<string>('SENIOR_URL');

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
            <empresa>${company}</empresa>
            <parametroBusca>${filter}</parametroBusca>
            <pagina>${page}</pagina>
            <quantidadeRegistros>${limit}</quantidadeRegistros>
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

    return {
      data,
    };
  }
}
