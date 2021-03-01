class TaggingStateHolder extends StateHolder {

    constructor({
                    currentState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changeManager = new StateChangesCollector(stateChangeMapper)
                }) {
        super({currentState, stateChangeMapper, changeManager});
    }
}