import axios from 'axios';
import Store from './Store';
import { authInfo } from './slices/Constants';
import { useCookies } from 'react-cookie';

const baseUrl = 'https://api-srrafa.herokuapp.com/api/'

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'content-type': 'application/json',
        accept: 'application/json'
    }
});

export const axiosFetchInstance = (tokens) => {
    const Fetch = axios.create({
        baseURL: baseUrl,
        timeout: 60000,
        headers: {
            Authorization: tokens
                ? `Bearer ${tokens.access_token}`
                : null,
            'content-type': 'application/json',
            accept: 'application/json'
        }
    });
    return Fetch
}

// export const axiosFetchInstance = axios.create({
//     baseURL: baseUrl,
//     timeout: 20000,
//     headers: {
//         Authorization: tokens
//             ? `Bearer ${tokens.access_token}`
//             : null,
//         'content-type': 'application/json',
//         accept: 'application/json'
//     }
// });

export const handleUnauthorized = (error, snackbar) => {
    const { response } = error
    const originalRequest = response.config
    const [setCookie, cookies] = useCookies(['currency_news'])
    const token = cookies.tokens

    if (typeof error === 'undefined') {
        snackbar(
            `A server/network error
            looks like cors may be the problem
            sorry about this, we will get it fixed shortly`,
            'error'
        );
        setTimeout(()=> {
             axiosFetchInstance(originalRequest)
        },3000)
    }
    if (
        response.status === 401 &&
        response.data.detail === "Authentication credentials were not provided." &&
        response.statusText === "Unauthorized"
        ){
            Store.dispatch(authInfo({com:'login', state:'open'}))
    }
    if (
        response.status === 401 &&
        response.data.detail === "Invalid token header. No credentials provided." &&
        response.statusText === "Unauthorized"
    ){
        const refresh_token = token.refresh_token
        if (refresh_token){
            const body = JSON.stringify({
                grant_type: "refresh_token",
                client_id: Store.getState().constants.client_id,
                client_secret: Store.getState().constants.client_secret,
                refresh_token
            })
            axiosInstance
            .post('/account/auth/token/', body)
            .then(res => {
                const date = new Date();
                setCookie("tokens", res.data, {
                expires: date.setSeconds(date.getSeconds + res.data.expires_in),
                path: "/",
                });
                originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                console.log(originalRequest)
                return axiosFetchInstance(originalRequest)
            })
            .catch(error => console.log(error))
        } else {
            Store.dispatch(authInfo({com:'login', state:'open'}))
        }

    }
    if (
        response.status === 401 &&
        originalRequest.data.refresh_token
    ) Store.dispatch(authInfo({com:'login', state:'open'}))

}

// axiosFetchInstance.interceptors.response.use(
//     (response) => {
//         return response
//     },

//     async function (error) {
//         const originalRequest = error.config
//         if (typeof error === 'undefined') {
//         enqueueSnackbar(
//             `A server/network error
//             looks like cors may be the problem
//             sorry about this, we will get it fixed shortly`,
//             'error'
//         );
//             return Promise.reject(error);
//         };

//         if (
//             error.response.status === 401 &&
//             error.response.data.detail === "Authentication credentials were not provided." &&
//             error.response.statusText === "Unauthorized"
//             ){
//                 window.location.href = '/login'
//         }

//         if (
//             error.response.status === 401 &&
//             error.response.data.detail === "Invalid token header. No credentials provided." &&
//             error.response.statusText === "Unauthorized"
//         ){
//             const refresh_token = localStorage.getItem('foxCodes_refreshToken')
//             if (refresh_token){
//                 const body = JSON.stringify({
//                     grant_type: "refresh_token",
//                     client_id: Store.getState().constants.client_id,
//                     client_secret: Store.getState().constants.client_secret,
//                     refresh_token
//                 })
//                 axiosInstance
//                 .post('/account/auth/token/', body)
//                 .then(res => {
//                     const date = new Date();
//                     setCookie("tokens", res.data, {
//                     expires: date.setSeconds(date.getSeconds + res.data.expires_in),
//                     path: "/",
//                     });
//                     originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
//                     console.log(originalRequest)
//                     return axiosFetchInstance(originalRequest)
//                 })
//                 .catch(error => console.log(error))
//             } else {
//                 window.location.href = '/login'
//             }

//         }
//         if (
//             error.response.status === 401 &&
//             originalRequest.data.refresh_token
//         ) window.location.href = '/login'
//     }
// )
