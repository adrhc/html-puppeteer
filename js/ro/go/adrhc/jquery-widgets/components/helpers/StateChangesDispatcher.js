class StateChangesDispatcher {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {string[]}
     */
    knownChangeTypes = [];
    /**
     * @type {string[]}
     */
    knownPartChangeTypes = [];

    /**
     * @param component {AbstractComponent}
     */
    constructor(component) {
        this.component = component;
    }

    /**
     * Process (orderly) multiple state changes to update the view.
     *
     * @param [stateChanges] {TaggedStateChange[]|undefined}
     * @param [applyChangesStartingFromNewest] {boolean}
     * @return {Promise<TaggedStateChange[]>}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest) {
        stateChanges = stateChanges ? stateChanges :
            this.component.state.stateChanges.consumeAll(applyChangesStartingFromNewest);
        if (!stateChanges || !stateChanges.length) {
            // can happen when switching to undefined multiple times (e.g. dblclick on header)
            // or clicking in an input box on an editable row
            console.warn(`${this.component.constructor.name}: no state changes!`);
            return Promise.resolve(stateChanges);
        }
        const promiseHolder = {};
        stateChanges.forEach(stateChange => {
            if (promiseHolder.promise) {
                promiseHolder.promise = promiseHolder.promise.then(() => this.updateViewOnStateChange(stateChange));
            } else {
                promiseHolder.promise = this.updateViewOnStateChange(stateChange);
            }
        });
        return promiseHolder.promise.then(() => stateChanges);
    }

    /**
     * @param [stateChange] {TaggedStateChange}
     * @return {Promise<TaggedStateChange>}
     */
    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.component.state.stateChanges.consumeOne();
        if (!stateChange) {
            console.warn(`${this.component.constructor.name}: no state changes!`);
            return Promise.resolve(stateChange);
        }

        const partName = stateChange.partName == null ? "" : stateChange.partName;
        const fnName = `updateViewOn${stateChange.changeType}`;

        if (partName) {
            let partFnName = `${fnName}${partName}`;
            if (typeof this.component[partFnName] === "function") {
                return this.component[partFnName](stateChange);
            }
            partFnName = `updateViewOnKnown${partName}StateChange`;
            if (this.component[partFnName] && this.knownPartChangeTypes.includes(stateChange.changeType)) {
                return this.component[partFnName](stateChange);
            }
            partFnName = `updateViewOnAny${partName}`;
            if (this.component[partFnName]) {
                return this.component[partFnName](stateChange);
            }
        }

        if (typeof this.component[fnName] === "function") {
            return this.component[fnName](stateChange);
        } else if (this.knownChangeTypes.includes(stateChange.changeType)) {
            return this.component.updateViewOnKnownStateChange(stateChange);
        } else {
            return this.component.updateViewOnAny(stateChange);
        }
    }

    /**
     * @param changeType {string}
     */
    prependKnownChangeTypess(...changeType) {
        changeType.forEach(it => this.knownChangeTypes.splice(0, 0, it));
    }

    /**
     * @param changeType {string}
     */
    prependPartKnownChangeTypess(...changeType) {
        changeType.forEach(it => this.knownPartChangeTypes.splice(0, 0, it));
    }

    /**
     * "is know request type?" or "is not applicable (situation)?" (question)
     *
     * @param {string} changeType
     * @return {boolean|boolean}
     */
    isKnownChangeTypesOrNA(changeType) {
        return !this.knownChangeTypes || this.knownChangeTypes.length === 0 || this.knownChangeTypes.includes(changeType);
    }

    /**
     * "is know request type?" or "is not applicable (situation)?" (question)
     *
     * @param {string} changeType
     * @return {boolean|boolean}
     */
    isKnownPartChangeTypeOrNA(changeType) {
        return !this.knownPartChangeTypes || this.knownPartChangeTypes.length === 0 || this.knownPartChangeTypes.includes(changeType);
    }
}