/**
 * @template T, P
 * @extends {StateHolder<T, P>}
 */
class TaggingStateHolder extends StateHolder {
    /**
     * @param {Object} params
     * @param {undefined|TaggingStateChangeMapper<T|P>} [params.stateChangeMapper]
     * @param {{initialState: undefined|T, changesCollector: undefined|StateChangesCollector<T|P>=}} [params.superParams]
     */
    constructor({stateChangeMapper, ...superParams} = {}) {
        super({
            stateChangeMapper: stateChangeMapper ?? new TaggingStateChangeMapper(),
            ...superParams
        });
    }
}