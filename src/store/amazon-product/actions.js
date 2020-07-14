export function getAmazonProducts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/amazon-products';

        payload.vm.$get(urlPath, {
            page: context.state.paginationMeta.current_page,
            s: context.state.pipeline.s,
            f: context.state.pipeline.f
        })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.amazonProducts.pagination_meta);
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
            project_id: payload.project_id
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

export function updateAmazonProductsPipeline(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updatePipeline', payload);
        resolve(true)
    })
}
