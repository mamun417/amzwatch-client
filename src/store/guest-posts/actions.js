export function getGuestPosts(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$get(`/projects/${payload.project_id}/guest-posts`)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
