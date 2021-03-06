/**
 * @template T
 * @extends {StateHolder<T>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {T} [initialState]
     * @param {TaggingStateChangeMapper<T>} [stateChangeMapper]
     * @param {StateChangesCollector<T>} [changeManager]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changeManager = new StateChangesCollector(stateChangeMapper)
                }) {
        super({initialState, stateChangeMapper, changeManager});
    }
}