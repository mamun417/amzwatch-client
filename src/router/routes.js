const routes = [
    {
        path     : '/',
        component: () => import('layouts/MainLayout.vue'),
        meta     : {requiresAuth: true},
        children : [
            {
                path     : '',
                component: () => import('pages/Index.vue')
            },
            {
                path     : '/projects',
                component: () => import('pages/project/ProjectListing.vue')
            },
            {
                path     : '/projects/:project_id',
                component: () => import('pages/project/SingleProject.vue')
            },
            {
                path     : '/projects/:project_id/broken-links-check',
                component: () => import('pages/broken-link/BrokenLinkListing')
            },
            {
                path     : '/projects/:project_id/amazon-products-check',
                component: () => import('pages/amazon-product/AmazonProductListing')
            },
            {
                path     : '/projects/:project_id/guest-links-check',
                component: () => import('pages/guest-post/GuestPostListing')
            },
            {
                path     : '/projects/:project_id/domain-uptime-check',
                component: () => import('pages/domain-uptime/DomainUptime')
            },
            
            {
                path     : '/profile',
                component: () => import('layouts/ProfileLayout.vue'),
                meta     : {requiresAuth: true},
                children : [
                    {
                        path     : '',
                        component: () => import('pages/profile/Profile.vue')
                    },
                ]
            }
        ]
    },
    
    {
        path     : '/auth',
        component: () => import('layouts/AuthLayout'),
        children : [
            {path        : 'login',
                component: () => import('pages/auth/login')
            },
            {path        : 'register',
                component: () => import('pages/auth/register')
            },
            {path        : 'logout',
                component: () => import('pages/auth/Logout')
            }
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
