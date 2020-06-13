import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'

import broken_links from './broken-links'
import amazon_products_links from './amazon-product'
import guest_links from './guest-posts'
import projects from './project'
import pages_speed from './pages-speed'
import domain_uptime from './domain-uptime'
import notifications from './notifications'

import ui from './ui'

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
            projects,
            pages_speed,
            domain_uptime,
            notifications,

            ui
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })
}
