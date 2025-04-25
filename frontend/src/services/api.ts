import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { cleanCookies } from '../contexts/AuthContext';

let cookies = parseCookies();

interface IFailedRequestsQueue {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

let failedRequestsQueue: IFailedRequestsQueue[] = [];
let isRefreshing = false;

function getCompany() {
    cookies = parseCookies();
    const company = cookies['finance.company'];

    if (company) {
        return JSON.parse(company).companyId;
    }

    return null;
}

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_HOST ?? 'http://localhost:80'}`,
    headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${cookies['finance.token']}`,
        'x-company': getCompany(),
    },
});

api.interceptors.response.use(
    response => {
        return response;
    },
    (error: AxiosError) => {
        // if (error.response.status === 401) {
        //     if (error.response.data?.code === 901) {
        //         cookies = parseCookies();
        //         const { 'finance.refreshToken': refreshToken } = cookies;
        //         const originalConfig = error.config;

        //         if (!isRefreshing) {
        //             isRefreshing = true;

        //             api.post(
        //                 '/refresh-token',
        //                 {},
        //                 {
        //                     headers: {
        //                         'x-access-token': refreshToken,
        //                     },
        //                 },
        //             )
        //                 .then(response => {
        //                     const { token, refreshToken } = response.data;

        //                     setCookie(undefined, 'finance.token', token, {
        //                         maxAge: 60 * 60 * 12 * 1, // 1 hour
        //                     });

        //                     // Gravando o refreshToken no cookie
        //                     setCookie(
        //                         undefined,
        //                         'finance.refreshToken',
        //                         refreshToken,
        //                         {
        //                             maxAge: 60 * 60 * 12 * 30, // 30 days
        //                         },
        //                     );

        //                     api.defaults.headers[
        //                         'Authorization'
        //                     ] = `Bearer ${response.data.token}`;

        //                     failedRequestsQueue.forEach(request =>
        //                         request.onSuccess(token),
        //                     );
        //                 })
        //                 .catch(err => {
        //                     failedRequestsQueue.forEach(request =>
        //                         request.onFailure(err),
        //                     );
        //                 })
        //                 .finally(() => {
        //                     isRefreshing = false;
        //                     failedRequestsQueue = [];
        //                 });
        //         }
        //         return new Promise((resolve, reject) => {
        //             failedRequestsQueue.push({
        //                 onSuccess: (token: string) => {
        //                     originalConfig.headers[
        //                         'Authorization'
        //                     ] = `Bearer ${token}`;

        //                     resolve(api(originalConfig));
        //                 },
        //                 onFailure: (error: AxiosError) => {
        //                     reject(error);
        //                 },
        //             });
        //         });
        //     }
        //     cleanCookies(true);
        // }

        return Promise.reject(error);
    },
);
