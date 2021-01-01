class AbstractComponent {
    /**
     * @param state {BasicState}
     * @param view {AbstractView}
     * @param knownRequestTypes {string[]}
     */
    constructor(state, view, knownRequestTypes = []) {
        this.state = state;
        this.view = view;
        this.knownRequestTypes = knownRequestTypes;
    }

    /**
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return Promise.resolve(undefined);
    }

    close() {
        // do nothing by default
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields = false) {
        const inputValues = this.extractInputValues(useOwnerOnFields);
        return EntityUtils.prototype.removeTransientId(inputValues);
    }

    /**
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractInputValues(useOwnerOnFields = false) {
        return this.view.extractInputValues(useOwnerOnFields);
    }

    /**
     * Process (orderly) multiple state changes to update the view.
     *
     * @param stateChanges {StateChange[]|undefined}
     * @param applyChangesStartingFromLatest {boolean|undefined}
     * @return {Promise<StateChange[]>}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromLatest) {
        stateChanges = stateChanges ? stateChanges : this.state.consumeAll(applyChangesStartingFromLatest);
        if (!stateChanges || !stateChanges.length) {
            console.warn("no state changes!");
            return Promise.resolve(stateChanges);
        }
        const promiseHolder = {promise: this.updateViewOnStateChange(stateChanges[0])};
        stateChanges.shift();
        stateChanges.forEach(stateChange => {
            promiseHolder.promise = promiseHolder.promise.then(() => this.updateViewOnStateChange(stateChange));
        });
        return promiseHolder.promise.then(() => stateChanges);
    }

    /**
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnStateChange(stateChange) {
        stateChange = stateChange ? stateChange : this.state.consumeOne();
        if (!stateChange) {
            console.warn("no state change!");
            return Promise.resolve(stateChange);
        }
        const fnName = `updateViewOn${stateChange.requestType}`;
        if (typeof this[fnName] === "function") {
            return this[fnName](stateChange);
        } else if (this.knownRequestTypes.includes(stateChange.requestType)) {
            return this._updateViewOnKnownStateChange(stateChange);
        } else if (typeof this["updateViewOnAny"] === "function") {
            return this["updateViewOnAny"](stateChange);
        } else {
            console.warn(`no handler for:\n${JSON.stringify(stateChange)}`);
            return Promise.reject(stateChange);
        }
    }

    /**
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     * @protected
     */
    _updateViewOnKnownStateChange(stateChange) {
        console.warn(`rejected:\n${JSON.stringify(stateChange)}`);
        return Promise.reject(stateChange);
    }

    /**
     * @param events {string,string[]}
     * @return {string|*}
     * @protected
     */
    _withNamespaceFor(events) {
        if ($.isArray(events)) {
            return events.map(ev => this._withNamespaceFor(ev)).join(" ");
        } else {
            return `${events}${this._eventsNamespace}`;
        }
    }

    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @protected
     */
    _handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    /**
     * @returns {string}
     * @protected
     */
    get _eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }

    get owner() {
        throw "Not implemented!";
    }
}