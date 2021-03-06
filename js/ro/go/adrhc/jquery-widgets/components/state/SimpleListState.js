/**
 * @template TItem, P
 * @typedef {TItem[]} T
 * @typedef {T|P} StateOrPart
 * @extends {TaggingStateHolder<T, P>}
 */
class SimpleListState extends TaggingStateHolder {
    /**
     * @param {T} [initialState]
     * @param {TaggingStateChangeMapper<T>} [stateChangeMapper]
     * @param {StateChangesCollector<T>} [changeManager]
     */
    constructor({initialState = [], stateChangeMapper, changeManager}) {
        super({initialState, stateChangeMapper, changeManager});
    }

    /**
     * @return {T}
     */
    get items() {
        return this.currentState;
    }

    /**
     * @param {T} items
     */
    set items(items) {
        this.currentState = items;
    }

    /**
     * @param {T} [items=[]]
     */
    updateAll(items = []) {
        this.replaceEntirely(items);
    }
}