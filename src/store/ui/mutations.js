export function updateSingleLoaderToTrue(state, name) {
    state.singleLoaderStatus[name] = true;
    
    // currently if u spam with same name counter will increase
    if (state.singleLoaderCounter.hasOwnProperty(name)) {
        state.singleLoaderCounter += 1
    }
}

export function updateSingleLoaderToFalse(state, name) {
    state.singleLoaderStatus[name] = true;
    
    if (state.singleLoaderCounter.hasOwnProperty(name) && state.singleLoaderCounter > 0) {
        state.singleLoaderCounter += 1
    } else {
        state.singleLoaderStatus[name] = false
    }
}
