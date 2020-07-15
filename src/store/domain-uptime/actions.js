export function getDomainUptimeTimeline(context, payload) {
    return new Promise((resolve, reject) => {
        let urlPath = '/projects/' + payload.project_id + '/domain-uptime-timeline';

        payload.vm.$get(urlPath, { log_type: payload.log_type })
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

        payload.vm.$get(urlPath, {
            log_type: payload.log_type,
            page: context.state.paginationMeta.current_page,
            f: context.state.pipeline.f
        })
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

export function updateDomainUptimeLogsPipeline(context, payload) {
    return new Promise((resolve, reject) => {
        context.commit('updatePipeline', payload);
        resolve(true)
    })
}
