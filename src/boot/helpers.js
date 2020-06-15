import moment from 'moment'
import lodash from 'lodash'

export default function ({store, app, Vue}) {
    Vue.prototype.$moment = moment;
    Vue.prototype.$_      = lodash;

    Vue.prototype.$singleLoaderTrue = function (name) {
        store.dispatch('ui/setSingleLoaderToTrue', name);
    }

    Vue.prototype.$singleLoaderFalse = function (name) {
        store.dispatch('ui/setSingleLoaderToFalse', name);
    }

    Vue.prototype.$timestampToDate = function (timestamp, format = "DD MM YYYY, h:mm:ss a") {
        return moment(parseInt(timestamp)).format(format)
    }
}
