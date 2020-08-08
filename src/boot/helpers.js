import moment from 'moment'
import lodash from 'lodash'

export default function ({ store, app, Vue }) {
    Vue.prototype.$moment = moment;
    Vue.prototype.$_ = lodash;
    Vue.prototype.$intervalTime = 180000; // 3 min in milsec

    Vue.prototype.$singleLoaderTrue = function (name) {
        store.dispatch('ui/setSingleLoaderToTrue', name);
        this.$forceUpdate();
    }

    Vue.prototype.$singleLoaderFalse = function (name) {
        store.dispatch('ui/setSingleLoaderToFalse', name);
        this.$forceUpdate();
    }

    Vue.prototype.$timestampToDate = function (timestamp, format = "DD MM YYYY, h:mm:ss a") {
        return moment(parseInt(timestamp)).format(format)
    }

    Vue.prototype.$fromNowTime = function (timestamp) {
        return moment(parseInt(timestamp)).fromNow()
    }

    Vue.prototype.$updatePipeline = function (storeState, payloadState) {
        let payloadStateKeys = Object.keys(payloadState);
        storeState = lodash.cloneDeep(storeState)

        if (!payloadStateKeys.length) return storeState;

        payloadStateKeys.forEach(pipelineKey => {
            if (storeState.hasOwnProperty(pipelineKey)) {
                storeState[pipelineKey] = payloadState[pipelineKey]
            }
        })

        return storeState
    }

    Vue.prototype.gotoNewTab = function (link) {
        window.open(link, '_blank');
    }
}
