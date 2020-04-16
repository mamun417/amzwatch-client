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
