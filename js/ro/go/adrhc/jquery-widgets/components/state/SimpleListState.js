class SimpleListState extends TaggingStateHolder {
    /**
     * @param {*} [initialState]
     * @param {TaggingStateChangeMapper} [stateChangeMapper]
     * @param {StateChangesCollector} [changeManager]
     */
    constructor({initialState = [], stateChangeMapper, changeManager}) {
        super({initialState, stateChangeMapper, changeManager});
    }

    /**
     * @param [items=[]] {IdentifiableEntity[]}
     */
    updateAll(items = []) {
        this.replaceEntirely(items);
    }

    get items() {
        return this.currentState;
    }

    set items(items) {
        this.currentState = items;
    }
}