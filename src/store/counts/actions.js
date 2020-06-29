export function getProjectsCount(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects-count';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getPagesCount(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/pages-count';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getProductsCount(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/products-count';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}