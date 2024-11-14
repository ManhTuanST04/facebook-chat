export interface HttpOptions {
    url?: string;
    path?: string;
    body?: any;
    headers?: any;
    params?: any;
    cacheMins?: number;
    isAuthentication?: boolean;
    uuid?: string;
    withCredentials?: boolean;
}
