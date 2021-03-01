class TaggingStateHolder extends StateHolder {
    /**
     * @param {*} [initialState]
     * @param {TaggingStateChangeMapper} [stateChangeMapper]
     * @param {StateChangesCollector} [changeManager]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changeManager = new StateChangesCollector(stateChangeMapper)
                }) {
        super({initialState, stateChangeMapper, changeManager});
    }
}