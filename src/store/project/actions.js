export function getProjects(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/projects/'+payload.project_id)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
