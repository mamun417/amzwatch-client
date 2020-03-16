const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {path: '', component: () => import('pages/Index.vue')},
            {path: '/projects', component: () => import('pages/project/ProjectListing.vue')},
            {path: '/projects/1', component: () => import('pages/project/SingleProject.vue')}
        ]
    },

    {
        path: '/auth',
        component: () => import('layouts/AuthLayout'),
        children: [
            {path: 'login', component: () => import('pages/auth/login')},
            {path: 'register', component: () => import('pages/auth/register')}
        ]
    }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue')
    })
}

export default routes
