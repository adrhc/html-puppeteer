class StateChangesDispatcher {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {string[]}
     */
    knownRequestTypes = [];
    /**
     * @type {string[]}
     */
    knownPartRequestTypes = [];

    /**
     * @param component {AbstractComponent}
     */
    constructor(component) {
        this.component = component;
    }

    /**
     * Process (orderly) multiple state changes to update the view.
     *
     * @param [stateChanges] {StateChange[]|undefined}
     * @param [applyChangesStartingFromNewest] {boolean}
     * @return {Promise<StateChange[]>}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest) {
        stateChanges = stateChanges ? stateChanges : this.component.state.consumeAll(applyChangesStartingFromNewest);
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
     * @param [stateChange] {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.component.state.consumeOne();
        if (!stateChange) {
            console.warn(`${this.component.constructor.name}: no state changes!`);
            return Promise.resolve(stateChange);
        }

        const partName = stateChange.partName == null ? "" : stateChange.partName;
        const fnName = `updateViewOn${stateChange.requestType}`;

        if (partName) {
            let partFnName = `${fnName}${partName}`;
            if (typeof this.component[partFnName] === "function") {
                return this.component[partFnName](stateChange);
            }
            partFnName = `updateViewOnKnown${partName}StateChange`;
            if (this.component[partFnName] && this.knownPartRequestTypes.includes(stateChange.requestType)) {
                return this.component[partFnName](stateChange);
            }
            partFnName = `updateViewOnAny${partName}`;
            if (this.component[partFnName]) {
                return this.component[partFnName](stateChange);
            }
        }

        if (typeof this.component[fnName] === "function") {
            return this.component[fnName](stateChange);
        } else if (this.knownRequestTypes.includes(stateChange.requestType)) {
            return this.component.updateViewOnKnownStateChange(stateChange);
        } else {
            return this.component.updateViewOnAny(stateChange);
        }
    }

    /**
     * @param requestType {string}
     */
    prependKnownRequestTypes(...requestType) {
        requestType.forEach(it => this.knownRequestTypes.splice(0, 0, it));
    }

    /**
     * @param requestType {string}
     */
    prependPartKnownRequestTypes(...requestType) {
        requestType.forEach(it => this.knownPartRequestTypes.splice(0, 0, it));
    }

    /**
     * "is know request type?" or "is not applicable (situation)?" (question)
     *
     * @param {string} requestType
     * @return {boolean|boolean}
     */
    isKnownRequestTypeOrNA(requestType) {
        return !this.knownRequestTypes || this.knownRequestTypes.length === 0 || this.knownRequestTypes.includes(requestType);
    }

    /**
     * "is know request type?" or "is not applicable (situation)?" (question)
     *
     * @param {string} requestType
     * @return {boolean|boolean}
     */
    isKnownPartRequestTypeOrNA(requestType) {
        return !this.knownPartRequestTypes || this.knownPartRequestTypes.length === 0 || this.knownPartRequestTypes.includes(requestType);
    }
}