import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';

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
}
