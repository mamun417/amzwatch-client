export function updateDomainUptimeCheckService(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/projects/' + payload.project_id + '/domain-uptime', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
