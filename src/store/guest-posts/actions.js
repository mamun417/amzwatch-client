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

export function updateProjectsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}
