export function getProjects(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$get('/projects')
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
