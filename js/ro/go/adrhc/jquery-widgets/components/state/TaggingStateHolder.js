/**
 * @template T, P
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {T} [initialState]
     * @param {TaggingStateChangeMapper<T|P>} [stateChangeMapper]
     * @param {StateChangesCollector<T|P>} [changesCollector]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new TaggingStateChangeMapper(),
                    changesCollector = new StateChangesCollector(stateChangeMapper)
                } = {}) {
        super({initialState, stateChangeMapper, changesCollector});
    }
}