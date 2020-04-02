export function authSuccess(state, {token, user}) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    state.token = token;
    state.user = user;
}

export function authOut(state) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    state.token = '';
    state.user = {};
}
