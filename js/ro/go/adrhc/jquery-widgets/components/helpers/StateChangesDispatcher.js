class StateChangesDispatcher {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {string}
     */
    handlerPrefix = "updateViewOn";
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
     * @param {TaggedStateChange[]=} stateChanges
     * @param {boolean=} applyChangesStartingFromNewest
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

        let partChangeHandlerName = this._partChangeHandlerNameOf(stateChange.changeType, stateChange.partName);
        if (partChangeHandlerName) {
            return this.component[partChangeHandlerName](stateChange);
        }

        let handlerName = this._handlerNameOf(stateChange.changeType);
        return this.component[handlerName](stateChange);
    }

    _handlerNameOf(changeType) {
        let handlerName = this.stateChangeHandlers.handlerNameOf(changeType);
        if (typeof this.component[handlerName] === "function") {
            return handlerName;
        }
        handlerName = `${this.handlerPrefix}${changeType}`;
        if (typeof this.component[handlerName] === "function") {
            return handlerName;
        } else {
            return `${this.handlerPrefix}Any`;
        }
    }

    _partNameOf(stateChangePartName) {
        return stateChangePartName == null ? undefined :
            (this.partName == null ? stateChangePartName : this.partName);
    }

    _partChangeHandlerNameOf(changeType, stateChangePartName) {
        const partName = this._partNameOf(stateChangePartName);
        if (!partName) {
            return undefined;
        }
        let partChangeHandlerName = this.partChangeHandlers.handlerNameOf(changeType);
        if (typeof this.component[partChangeHandlerName] === "function") {
            return partChangeHandlerName;
        }
        partChangeHandlerName = `${this.handlerPrefix}${partName}${changeType}`;
        if (typeof this.component[partChangeHandlerName] === "function") {
            return partChangeHandlerName;
        }
        partChangeHandlerName = `${this.handlerPrefix}Any${partName}`;
        if (this.component[partChangeHandlerName]) {
            return partChangeHandlerName;
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
    static ANY = "ANY";

    /**
     * @type {{}}
     */
    stateChangeHandlers = {};

    /**
     * Assigns handlerName to change types.
     *
     * @param {string} handlerName
     * @param {string|number} changeType
     */
    setHandlerName(handlerName, ...changeType) {
        this.stateChangeHandlers[handlerName] = changeType;
    }

    /**
     * @param {{}} config containing {handlerName: [changeTypes]}
     */
    configureHandlerName(config) {
        $.extend(this.stateChangeHandlers, config);
    }

    /**
     * @param {string|number} changeType
     * @return {string|undefined}
     */
    handlerNameOf(changeType) {
        if (!this.stateChangeHandlers) {
            return undefined;
        }
        let handlerOfAny;
        for (let handlerName in this.stateChangeHandlers) {
            if (this.stateChangeHandlers[handlerName].includes(changeType)) {
                return handlerName;
            }
            if (this.stateChangeHandlers[handlerName].includes(StateChangeHandlersManager.ANY)) {
                handlerOfAny = handlerName;
            }
        }
        return handlerOfAny;
    }

    /**
     * @param {string} handlerName
     * @param {string|number} changeType
     */
    isHandlerOf(handlerName, changeType) {
        return handlerName === this.handlerNameOf(changeType);
    }
}