const routes = [
    {
        path     : '/',
        component: () => import('layouts/MainLayout.vue'),
        children : [
            {path: '', component: () => import('pages/Index.vue')},
            {path: '/projects', component: () => import('pages/project/ProjectListing.vue')},
            {path: '/projects/1', component: () => import('pages/project/SingleProject.vue')},
            {path: '/projects/1/broken-links-check', component: () => import('pages/broken-link/BrokenLinkListing')},
            {path: '/projects/1/amazon-products-check', component: () => import('pages/amazon-product/AmazonProductListing')},
            {path: '/projects/1/guest-links-check', component: () => import('pages/guest-link/GuestLinkListing')}
        ]
    },

    {
        path     : '/auth',
        component: () => import('layouts/AuthLayout'),
        children : [
            {path: 'login', component: () => import('pages/auth/login')},
            {path: 'register', component: () => import('pages/auth/register')}
        ]
    }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path     : '*',
        component: () => import('pages/Error404.vue')
    })
}

export default routes
