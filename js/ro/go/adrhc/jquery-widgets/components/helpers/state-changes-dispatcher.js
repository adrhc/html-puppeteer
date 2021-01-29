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
        const fnName = `updateViewOn${stateChange.requestType}`;
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
}