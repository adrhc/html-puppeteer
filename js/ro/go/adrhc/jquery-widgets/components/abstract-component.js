class AbstractComponent {
    /**
     * @param state {BasicState}
     * @param view {AbstractView}
     */
    constructor(state, view) {
        this.state = state;
        this.view = view;
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
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @protected
     */
    handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    /**
     * @return {Promise<StateChange|undefined>}
     */
    init() {
        return Promise.resolve(undefined);
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
        } else if (this.getKnownRequestTypes().includes(stateChange.requestType)) {
            return this["updateViewOnKnownStateChange"](stateChange);
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
     */
    updateViewOnKnownStateChange(stateChange) {
        console.warn(`"do nothing" handler for:\n${JSON.stringify(stateChange)}`);
        return Promise.resolve(stateChange);
    }

    /**
     * @returns {string[]} representing known request types (handleable with updateViewOnKnownStateChange)
     */
    getKnownRequestTypes() {
        return [];
    }

    /**
     * @param events {string,string[]}
     * @return {string|*}
     */
    withNamespaceFor(events) {
        if ($.isArray(events)) {
            return events.map(ev => this.withNamespaceFor(ev)).join(" ");
        } else {
            return `${events}${this.eventsNamespace}`;
        }
    }

    get eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }

    get owner() {
        throw "Not implemented!";
    }

    close() {
        // do nothing by default
    }
}