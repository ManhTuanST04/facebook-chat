import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from '../shares/models/http-options.dto';
import { v4 as uuidv4 } from 'uuid';

export enum Verbs {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE'
}

@Injectable({
    providedIn: 'root'
})
export class HttpClientService {
    constructor(private http: HttpClient) {}

    get<T>(options: HttpOptions): Observable<T> {
        return this.httpCall(Verbs.GET, options);
    }

    delete<T>(options: HttpOptions): Observable<T> {
        return this.httpCall(Verbs.DELETE, options);
    }

    post<T>(options: HttpOptions): Observable<T> {
        return this.httpCall(Verbs.POST, options);
    }

    put<T>(options: HttpOptions): Observable<T> {
        return this.httpCall(Verbs.PUT, options);
    }

    httpCall<T>(verb: Verbs, options: HttpOptions): Observable<T> {
        options.body = options.body ?? null;
        options.headers = this.buildHeaders(options.headers) ?? {};

        return this.http.request<T>(verb, `${options.url}/${options.path}`, {
            body: options.body,
            headers: options.headers,
            params: this.formatRequestData(options?.params ?? {}) ?? {},
            withCredentials: false
        });
    }

    buildHeaders(optionHeaders: any) {
        const headers = { ...optionHeaders, clientMessageId: uuidv4() }; // Add token CSRF to headers
        return headers;
    }

    formatRequestData(input: any): any {
        if (!input) return {};
        for (const key in input) {
            if (input[key] === undefined || input[key] === null) {
                input[key] = '';
            }
        }
        return input;
    }
}
