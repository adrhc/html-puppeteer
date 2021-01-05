class AbstractComponent {
    /**
     * @type {BasicState}
     */
    state;
    /**
     * @type {AbstractView}
     */
    view;
    /**
     * @type {StateChangesDispatcher}
     */
    stateChangesDispatcher;

    /**
     * @param state {BasicState}
     * @param view {AbstractView}
     */
    constructor(state, view) {
        this.state = state;
        this.view = view;
        this.stateChangesDispatcher = new StateChangesDispatcher(this);
    }

    updateViewOnStateChanges(stateChanges, applyChangesStartingFromLatest) {
        return this.stateChangesDispatcher.updateViewOnStateChanges(stateChanges, applyChangesStartingFromLatest);
    }

    updateViewOnStateChange(stateChange) {
        return this.stateChangesDispatcher.updateViewOnStateChange(stateChange);
    }

    /**
     * component initializer: (re)load state, update the view, configure events
     *
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return Promise.resolve(undefined);
    }

    close() {
        if (this.view.$elem) {
            this.view.$elem.off(this._eventsNamespace);
        }
        this.state.reset();
        this.view.reset();
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields) {
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
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnKnownStateChange(stateChange) {
        console.debug(`${this.constructor.name}._updateViewOnKnownStateChange:\n${JSON.stringify(stateChange)}`);
        return this.view.update(stateChange);
    }

    updateViewOnAny(stateChange) {
        console.debug(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        return this.view.update(stateChange);
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
            if (typeof jqXHR === "string" || typeof jqXHR === "number") {
                alert(jqXHR);
                throw jqXHR;
            } else {
                console.log(`errorThrown: ${errorThrown}`);
                alert(`${textStatus}\n${jqXHR.responseText}`);
                throw textStatus;
            }
        });
    }

    /**
     * @param events {string,string[]}
     * @return {string|*}
     * @protected
     */
    _appendNamespaceTo(events) {
        if ($.isArray(events)) {
            return events.map(ev => this._appendNamespaceTo(ev)).join(" ");
        } else {
            return `${events}${this._eventsNamespace}`;
        }
    }

    /**
     * @returns {string}
     * @protected
     */
    get _eventsNamespace() {
        return `.${this.constructor.name}.${this.view.owner}`;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _ownerSelector() {
        return `[data-owner='${this.view.owner}']`;
    }
}