import axios from 'axios'

export default function ({ store, Vue, router }) {
    axios.defaults.withCredentials = true;
    Vue.prototype.$http = axios

    let apiBase = process.env.PROD ? process.env.PROD_API_ENDPOINT : process.env.API_ENDPOINT;

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
                axios.get(apiBase + '/refresh')
                    .then(res => {
                        let token = res.data.bearerToken;

                        store.dispatch('auth/updateToken', token)

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

                        return axios(err.config)
                    })
                    .catch(err => {
                        // think what we need to do. i think do logout cz we cant refresh so do manual login
                    })
            }
            if (err.response.status === 422 && ['Bearer token invalid', 'Refresh token not found'].includes(err.response.data.message)) {
                store.dispatch('auth/logout').then(() => {
                    return router.push('/auth/login')
                })
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
