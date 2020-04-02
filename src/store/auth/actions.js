export function login(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/login', payload.inputs)
            .then(res => {
                let info = res.data
                context.commit('authSuccess', {user: info.user, token: info.bearerToken});

                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function logout(context) {
    return new Promise((resolve, reject) => {
        context.commit('authOut');
        resolve('test')
    })
}
