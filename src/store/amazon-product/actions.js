export function getAmazonProducts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/amazon-products?page=' + context.state.paginationMeta.current_page;

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getAmazonProductInPages(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$get('/amazon-products/' + payload.product_id, {
            affiliate_id: payload.affiliate_id
        }) //amazonproduct id
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateAmazonProductCheckService(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/projects/' + payload.project_id + '/amazon-products', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateAmazonProductsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}
