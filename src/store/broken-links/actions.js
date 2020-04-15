export function getBrokenLinks(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/broken-links/'+payload.project_id)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
