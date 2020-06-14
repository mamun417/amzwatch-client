export function getDomainUptimeDetails(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/domain-uptime';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

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
