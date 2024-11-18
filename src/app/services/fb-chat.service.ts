import { Injectable } from '@angular/core';
import { HttpClientService } from './httpclient.service';
import { HttpOptions } from '../shares/models/http-options.dto';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FbChatService {
    constructor(private httpClient: HttpClientService) {}

    getListConversation() {
        const options: HttpOptions = {
            url: environment.hostApi,
            path: 'v1/fb/conversations',
            params: {},
            body: {}
        };

        return this.httpClient.get(options);
    }

    getListMessage(conversationId: String) {
        const options: HttpOptions = {
            url: environment.hostApi,
            path: 'v1/fb/messages',
            params: {
                conversationId
            },
            body: {}
        };

        return this.httpClient.get(options);
    }

    sendMessage(recipientId: String, message: String) {
        const options: HttpOptions = {
            url: environment.hostApi,
            path: 'v1/fb/messages',
            params: {},
            body: {
                recipientId,
                message
            }
        };

        return this.httpClient.post(options);
    }
}
