export function getNotifications(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/notifications';

        payload.vm.$get(urlPath, {
            page: context.state.paginationMeta.current_page,
            limit: 50
        })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.notifications.pagination_meta);
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updateNotificationsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}
