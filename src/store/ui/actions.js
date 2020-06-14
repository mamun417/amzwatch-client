export function setSingleLoaderToTrue(context, payload) {
    context.commit('updateSingleLoaderToTrue', payload);
}

export function setSingleLoaderToFalse(context, payload) {
    context.commit('updateSingleLoaderToFalse', payload);
}