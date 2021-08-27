/**
 * @template T, P
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {undefined|TaggingStateChangeMapper<T|P>} [stateChangeMapper]
     * @param {{initialState: undefined|T, changesCollector: undefined|StateChangesCollector<T|P>=}} [options]
     */
    constructor({stateChangeMapper, options} = {}) {
        super({
            stateChangeMapper: stateChangeMapper ?? new TaggingStateChangeMapper(),
            ...options
        });
    }
}