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

export function addProject(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/projects', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateProject(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch(`/projects/${payload.project_id}`, payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
