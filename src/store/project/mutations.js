export function updatePaginationMeta(state, data) {
    state.paginationMeta = data;
}

export function updateCurrentPagePaginationMeta(state, current_page) {
    state.paginationMeta.current_page = current_page;
}

export function updatePipeline(state, payload) {
    state.pipeline = payload.vm.$updatePipeline(state.pipeline, payload.pipeline);
}