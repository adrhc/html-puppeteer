class StateChangesDispatcher {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {string}
     */
    partName;
    /**
     * @type {StateChangeHandlersManager}
     */
    stateChangeHandlers = new StateChangeHandlersManager();
    /**
     * @type {StateChangeHandlersManager}
     */
    partChangeHandlers = new StateChangeHandlersManager();

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
        stateChanges = stateChanges ? stateChanges : (this.component.state ?
            this.component.state.stateChanges.consumeAll(applyChangesStartingFromNewest) : undefined);
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

        const partName = stateChange.partName == null ? "" :
            (this.partName == null ? stateChange.partName : this.partName);

        if (partName) {
            let partChangeHandlerName = this.partChangeHandlers.handlerNameOf(stateChange.changeType);
            if (typeof this.component[partChangeHandlerName] === "function") {
                return this.component[partChangeHandlerName](stateChange);
            }
            partChangeHandlerName = `updateViewOn${partName}${stateChange.changeType}`;
            if (typeof this.component[partChangeHandlerName] === "function") {
                return this.component[partChangeHandlerName](stateChange);
            }
            partChangeHandlerName = `updateViewOnAny${partName}`;
            if (this.component[partChangeHandlerName]) {
                return this.component[partChangeHandlerName](stateChange);
            }
        }

        let handlerName = this.stateChangeHandlers.handlerNameOf(stateChange.changeType);
        if (typeof this.component[handlerName] === "function") {
            return this.component[handlerName](stateChange);
        }
        handlerName = `updateViewOn${stateChange.changeType}`;
        if (typeof this.component[handlerName] === "function") {
            return this.component[handlerName](stateChange);
        } else {
            return this.component.updateViewOnAny(stateChange);
        }
    }

    /**
     * @param {boolean|string} [partName]
     */
    usePartName(partName) {
        if (typeof partName === "boolean" && !partName) {
            this.partName = undefined;
        } else {
            this.partName = partName;
        }
    }
}

class StateChangeHandlersManager {
    static ALL = "ALL";

    /**
     * @type {{}}
     */
    stateChangeHandlers = {};

    /**
     * @param {string} handlerName
     * @param {string|number} changeType
     */
    setHandlerName(handlerName, ...changeType) {
        this.stateChangeHandlers[handlerName] = changeType;
    }

    /**
     * @param {string|number} changeType
     * @return {string|undefined}
     */
    handlerNameOf(changeType) {
        if (!this.stateChangeHandlers) {
            return undefined;
        }
        for (let handlerName in this.stateChangeHandlers) {
            if (this.stateChangeHandlers[handlerName].includes(changeType)) {
                return handlerName;
            }
        }
        return undefined;
    }

    /**
     * @param {string} handlerName
     * @param {string|number} changeTypes
     */
    isHandlerOf(handlerName, ...changeTypes) {
        const handledChangeTypes = this.stateChangeHandlers[handlerName];
        if (handledChangeTypes == null) {
            return false;
        }
        if (handledChangeTypes[0] === StateChangeHandlersManager.ALL) {
            return true;
        }
        for (let ct of changeTypes) {
            if (handledChangeTypes.includes(ct)) {
                return true;
            }
        }
        return false;
    }
}