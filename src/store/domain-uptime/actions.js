export function getDomainUptimePingTimeline(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/domain-uptime-ping-timeline';

        payload.vm.$get(urlPath, { time_upto: payload.time_upto, interval: payload.interval })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getDomainUptimeLatestDowntime(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/domain-uptime-latest-downtime';

        payload.vm.$get(urlPath, { log_type: payload.log_type })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function getDomainUptimeLogs(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/domain-uptime-logs';

        payload.vm.$get(urlPath, { log_type: payload.log_type, page: context.state.paginationMeta.current_page })
            .then(res => {
                context.commit('updatePaginationMeta', res.data.domainUptimeLogs.pagination_meta);
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

export function updateUptimeLogsCurrentPage(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updateCurrentPagePaginationMeta', payload);
        resolve(true)
    })
}

