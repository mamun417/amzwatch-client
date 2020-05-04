import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import broken_links from './broken-links'
import amazon_products_links from './amazon-product'
import guest_links from './guest-links'
import projects from './project'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
    return new Vuex.Store({
        modules: {
            auth,
            broken_links,
            amazon_products_links,
            guest_links,
            projects
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })
}
