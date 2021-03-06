/**
 * @template T
 */
class IdentityStateChangeMapper {
    /**
     * @param {StateChange<T>} stateChange
     * @return {StateChange<T>}
     */
    map(stateChange) {
        return stateChange;
    };
}