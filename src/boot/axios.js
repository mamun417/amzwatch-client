import Vue from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true;

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
        console.log(err)
        console.log(this)
        // this.$q.notify({
        //     color   : 'positive',
        //     message : 'Login Successful',
        //     position: 'top'
        // })
        Promise.reject(err).then(r => r)
    }
)

Vue.prototype.$http = axios

Vue.prototype.$apiBase = process.env.API_ENDPOINT;

Vue.prototype.$api = function (apiPath) {
    return this.$apiBase + apiPath;
}

Vue.prototype.$get = function (path) {
    return new Promise((resolve, reject) => {
        this.$http.get(this.$api(path))
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

