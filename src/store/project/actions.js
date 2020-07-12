export function getProjects(context, payload) {
    return new Promise((resolve, reject) => {
        // it will updated later for filter etc
        let urlPath = '/projects';

        payload.vm.$get(urlPath, {
            page: context.state.paginationMeta.current_page,
            s: context.state.pipeline.s,
            f: context.state.pipeline.f
        })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.userProjects.pagination_meta);
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getProject(context, payload) {
    return new Promise((resolve, reject) => {
        // it will updated later for filter etc
        let urlPath = `/projects/${payload.id}`;

        payload.vm.$get(urlPath)
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

export function updateProjectsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}

export function updateProjectsPipeline(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updatePipeline', payload);
        resolve(true)
    })
}
