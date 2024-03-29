export function getGuestPosts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/'+payload.project_id+'/guest-posts?page=' + context.state.paginationMeta.current_page;

        payload.vm.$get(urlPath)
            .then(res => {
                context.commit('updatePaginationMeta', res.data.linksInGuestPosts.pagination_meta);
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getAllGuestPosts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/'+payload.project_id+'/guest-posts?limit=999';
        
        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateGuestPostsCheckService(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/projects/' + payload.project_id + '/guest-posts', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateGuestPostsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}
