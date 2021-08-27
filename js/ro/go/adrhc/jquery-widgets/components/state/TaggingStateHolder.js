/**
 * @template T, P
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {{initialState: undefined|T, stateChangeMapper: undefined|TaggingStateChangeMapper<T|P>, changesCollector: undefined|StateChangesCollector<T|P>=}} options
     */
    constructor({initialState, stateChangeMapper, changesCollector}) {
        super({
            initialState,
            stateChangeMapper: stateChangeMapper ?? new TaggingStateChangeMapper(),
            changesCollector
        });
    }
}