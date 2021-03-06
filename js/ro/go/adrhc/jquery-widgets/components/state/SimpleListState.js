/**
 * @template TItem, P
 * @extends {TaggingStateHolder<TItem[], P>}
 */
class SimpleListState extends TaggingStateHolder {
    /**
     * @param {TItem[]} [initialState]
     * @param {TaggingStateChangeMapper<TItem[]>} [stateChangeMapper]
     * @param {StateChangesCollector<TItem[]>} [changeManager]
     */
    constructor({initialState = [], stateChangeMapper, changeManager}) {
        super({initialState, stateChangeMapper, changeManager});
    }

    /**
     * @return {TItem[]}
     */
    get items() {
        return this.currentState;
    }

    /**
     * @param {TItem[]} items
     */
    set items(items) {
        this.currentState = items;
    }

    /**
     * @param {TItem[]} [items=[]]
     */
    updateAll(items = []) {
        this.replaceEntirely(items);
    }
}