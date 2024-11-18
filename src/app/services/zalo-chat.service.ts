import { Injectable } from '@angular/core';
import { HttpClientService } from './httpclient.service';
import { HttpOptions } from '../shares/models/http-options.dto';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ZaloChatService {
    constructor(private httpClient: HttpClientService) {}

    getListMessage(conversationId: String) {
        const options: HttpOptions = {
            url: environment.hostApi,
            path: 'v1/zalo/messages',
            params: {
                conversationId,
                offset: 0,
                count: 10
            },
            body: {}
        };

        return this.httpClient.get(options);
    }

    sendMessage(recipientId: String, message: String) {
        const options: HttpOptions = {
            url: environment.hostApi,
            path: 'v1/zalo/messages',
            params: {},
            body: {
                recipientId,
                message
            }
        };

        return this.httpClient.post(options);
    }
}
