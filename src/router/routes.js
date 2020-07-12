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
                path     : '/projects/:project_id/pages-speed-check',
                component: () => import('pages/page-speed/PagesSpeedListing')
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
            },

            {
                path     : '/subscription',
                component: () => import('layouts/SubscriptionLayout.vue'),
                meta     : {requiresAuth: true},
                children : [
                    {
                        path     : '',
                        component: () => import('pages/subscription/Subscription.vue')
                    },
                ]
            }
        ]
    },

    {
        path     : '/auth',
        component: () => import('layouts/AuthLayout'),
        children : [
            {
                path  : 'login',
                name: 'login',
                component: () => import('pages/auth/Login')
            },
            {path        : 'register',
                component: () => import('pages/auth/Register')
            },
            {
                path : 'email/verify',
                name: 'verify',
                component: () => import('pages/auth/account-verification/Verify')
            },
            {
                path : 'email/verify/resend',
                name: 'verify.resend',
                component: () => import('pages/auth/account-verification/ResendVerifyEmail')
            },
            {
                path : 'account/verify/:token',
                name: 'verify.success',
                component: () => import('pages/auth/account-verification/Success')
            },
            {path        : 'logout',
                component: () => import('pages/auth/Logout')
            },
            {
                path : 'password/forgot',
                name: 'password.email',
                component: () => import('pages/auth/forgot-password/Email')
            },
            {
                path : 'password/reset/:token',
                name: 'password.reset',
                component: () => import('pages/auth/forgot-password/Reset')
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
