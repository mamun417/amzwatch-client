import moment from 'moment'

export default function ({store, app, Vue}) {
    Vue.prototype.$singleLoaderTrue = function (name) {
        store.dispatch('ui/setSingleLoaderToTrue', name);
    }
    
    Vue.prototype.$singleLoaderFalse = function (name) {
        store.dispatch('ui/setSingleLoaderToFalse', name);
    }
    
    Vue.prototype.$timestampToDate = function (timestamp, format="dddd, MMMM Do YYYY, h:mm:ss a") {
        return moment(timestamp).format(format)
    }
}
