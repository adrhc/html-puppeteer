/**
 * @template T, P
 * @typedef {T|P} StateOrPart
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {T} [initialState]
     * @param {TaggingStateChangeMapper<StateOrPart>} [stateChangeMapper]
     * @param {StateChangesCollector<StateOrPart>} [changeManager]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changeManager = new StateChangesCollector(stateChangeMapper)
                }) {
        super({initialState, stateChangeMapper, changeManager});
    }
}