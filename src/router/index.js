import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store}) {
    const Router = new VueRouter({
        scrollBehavior: () => ({x: 0, y: 0}),
        routes,

        // Leave these as they are and change in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    })

    Router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (store.getters['auth/isLoggedIn']) {
                if (to.path !== '/' && to.path.slice(-1) === '/') {
                    next(to.path.substring(0, to.path.length - 1));
                    return;
                } else {
                    next();
                    return;
                }
            }
            next('/auth/login');
        } else if (to.path === '/auth/login' && store.getters['auth/isLoggedIn']) {
            next('/'); // dont use only slash cz in line 37 we omit slash otherwise it will loop
        }

        next()
    });

    return Router
}
