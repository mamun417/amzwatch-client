import axios from 'axios'

export default function ({ store, Vue, router }) {
    axios.defaults.withCredentials = true;
    Vue.prototype.$http = axios

    let apiBase = process.env.PROD ? process.env.PROD_API_ENDPOINT : process.env.API_ENDPOINT;

    let temToken = ''
    let isRefreshing = false;

    Vue.prototype.$apiBase = apiBase;

    // handle before req happen
    axios.interceptors.request.use(
        req => {
            const token = localStorage.getItem('token');

            if (token) {
                req.headers['Authorization'] = 'Bearer ' + token
            }

            return req
        },
        err => {
            Promise.reject(err).then(r => r)
        }
    )

    // handle before res is send to client
    axios.interceptors.response.use(
        res => {
            return res
        },
        err => {
            if (err.response.status === 498 && err.response.data.message === 'Token Expired/Invalid') {

                if (!isRefreshing) {
                    isRefreshing = true;

                    return axios.get(apiBase + '/refresh')
                        .then(async (res) => {
                            temToken = res.data.bearerToken;

                            store.dispatch('auth/updateToken', temToken)

                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + temToken

                            isRefreshing = false;

                            return axios(err.config)
                        })
                        .catch(err => {
                            // think what we need to do. i think do logout cz we cant refresh so do manual login
                            isRefreshing = false;
                        })
                } else {
                    return new Promise((resolve, reject) => {
                        let intrvl = setInterval(async () => {
                            if (!isRefreshing) {
                                clearInterval(intrvl);

                                axios.defaults.headers.common['Authorization'] = 'Bearer ' + temToken

                                resolve(axios(err.config))
                            }
                        }, 300);
                    })
                }
            }
            else if (err.response.status === 422 && ['Bearer token invalid', 'Refresh token not found'].includes(err.response.data.message)) {
                store.dispatch('auth/logout').then(() => {
                    router.push('/auth/login')

                    return Promise.reject(err)
                })
            }
            else if (err.response.status === 403 && err.response.data.message === 'Forbidden') {
                return router.push('/')
            }
            else {
                return Promise.reject(err)
            }
        }
    )

    Vue.prototype.$api = function (apiPath) {
        return this.$apiBase + apiPath;
    }

    Vue.prototype.$get = function (path, queryParams) {
        return new Promise((resolve, reject) => {
            this.$http.get(this.$api(path), { params: queryParams })
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    Vue.prototype.$post = function (path, payload) {
        return new Promise((resolve, reject) => {
            this.$http.post(this.$api(path), payload)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    Vue.prototype.$patch = function (path, payload) {
        return new Promise((resolve, reject) => {
            this.$http.patch(this.$api(path), payload)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }


}
