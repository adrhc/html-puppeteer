/**
 * @template T
 * @extends {StateChange<T>}
 */
class ReplaceStateChange extends TaggedStateChange {
    /**
     * @param {T} previousStateOrPart
     * @param {T} stateOrPart
     * @param {string|number} [partName]
     */
    constructor(previousStateOrPart, stateOrPart, partName) {
        super(CUDTags.REPLACE, previousStateOrPart, stateOrPart, partName);
    }
}