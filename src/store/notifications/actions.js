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

export function updateNotifications(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/notifications/update';

        payload.vm.$patch(urlPath, {
            ids: payload.ids,
        })
            .then(res => {
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

export function getLatestIssues(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/latest-issues';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export function getLatestScrapedPages(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/latest-scraped-pages';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export function getLatestParsedPages(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/latest-parsed-pages';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export function getLatestScrapedProducts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/latest-scraped-products';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export function getLatestParsedProducts(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/latest-parsed-products';

        payload.vm.$get(urlPath)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
