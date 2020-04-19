export function getAmazonProducts(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$get('/projects/'+payload.project_id+'/amazon-products')
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
        payload.vm.$post('/amazon-products/'+payload.id, payload.inputs) //amazonproduct id
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
