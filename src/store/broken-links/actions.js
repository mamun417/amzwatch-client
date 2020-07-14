export function getBrokenLinks(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/broken-links/'+payload.project_id;

        payload.vm.$post(urlPath, {
            page: context.state.paginationMeta.current_page,
            s: context.state.pipeline.s,
            f: context.state.pipeline.f
        })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.brokenLinks.pagination_meta);
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateBrokenLinksCheckService(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/projects/' + payload.project_id + '/broken-links', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateBrokenLinksCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}

export function updateBrokenLinksPipeline(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updatePipeline', payload);
        resolve(true)
    })
}
