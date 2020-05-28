export function updatePagesSpeedCheckService(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/projects/' + payload.project_id + '/pages-speed', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}