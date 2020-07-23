export default function () {
    return {
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
    }
}
