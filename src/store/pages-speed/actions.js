export function getPagesSpeed(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/pages-speed';

        payload.vm.$get(urlPath, {
            page: context.state.paginationMeta.current_page,
            s: context.state.pipeline.s
        })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.pageSpeedResults.pagination_meta);
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

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


export function updatePageSpeedListCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}

export function updatePageSpeedPipeline(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updatePipeline', payload);
        resolve(true)
    })
}
