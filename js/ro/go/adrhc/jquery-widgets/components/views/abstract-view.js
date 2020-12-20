/**
 * @abstract
 */
class AbstractView {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     * @protected
     */
    _extractInputValues($elem, useOwnerOnFields) {
        const owner = useOwnerOnFields ? this.owner : undefined;
        return FormUtils.prototype.objectifyInputsOf($elem, owner);
    }

    /**
     * @param stageChanges {StateChange|StateChange[]}
     * @return {Promise<StateChange|StateChange[]>}
     * @abstract
     */
    update(stageChanges) {
        throw "Not implemented!";
    }

    /**
     * @abstract
     */
    get owner() {
        throw "Not implemented!";
    }

    /**
     * @param useOwnerOnFields {boolean|undefined}
     * @return {{}}
     * @abstract
     */
    extractInputValues(useOwnerOnFields) {
        throw "Not implemented!";
    }
}