import ApiService from '@/services/api.service';
import TokenService from '@/services/token.service';

import AuthenticateUser from '@/services/middleware/AuthenticateUser';

import HttpHeader from '@/enums/HttpHeader';
import MimeType from '@/enums/MimeType';

ApiService.setHeader(HttpHeader.AUTHORIZATION, `Bearer ${TokenService.get()}`);
ApiService.setHeader(HttpHeader.CONTENT_TYPE, MimeType.APPLICATION_JSON);
ApiService.addResponseMiddleware(AuthenticateUser);
