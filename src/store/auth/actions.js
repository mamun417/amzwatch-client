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

export function updateToken(context, token) {
    context.commit('updateToken', token);
}

export function register(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/register', payload.inputs)
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

export function updateProfile(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/update-profile', payload.inputs)
            .then(res => {
                let info = res.data
                context.commit('updateProfile', {user: info.user});

                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function checkCurrentPassword(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$post('/check-password', payload.inputs)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function updatePassword(context, payload) {
    return new Promise((resolve, reject) => {
        payload.vm.$patch('/change-password', payload.inputs)
            .then(res => {
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
