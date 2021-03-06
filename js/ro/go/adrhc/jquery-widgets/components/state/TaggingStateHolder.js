/**
 * @template T, P
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {T} [initialState]
     * @param {TaggingStateChangeMapper<T|P>} [stateChangeMapper]
     * @param {StateChangesCollector<T|P>} [changeManager]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changeManager = new StateChangesCollector(stateChangeMapper)
                } = {}) {
        super({initialState, stateChangeMapper, changeManager});
    }
}