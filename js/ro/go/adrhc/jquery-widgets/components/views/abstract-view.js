/**
 * @abstract
 */
class AbstractView {
    /**
     * @param stageChanges {StateChange|StateChange[]}
     * @return {Promise<StateChange|StateChange[]>}
     * @abstract
     */
    update(stageChanges) {
        throw "Not implemented!";
    }

    /**
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     */
    extractInputValues(useOwnerOnFields) {
        return undefined;
    }

    /**
     * @return {string}
     * @abstract
     */
    get owner() {
        throw "Not implemented!";
    }
}