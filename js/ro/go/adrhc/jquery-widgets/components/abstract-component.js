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
     * @type {CompositeBehaviour}
     */
    compositeBehaviour;
    /**
     * see this as the "child component" capability of the current/this component
     *
     * @type {ChildishBehaviour}
     */
    _childishBehaviour;

    /**
     * @param state {BasicState}
     * @param view {AbstractView}
     */
    constructor(state, view) {
        this.state = state;
        this.view = view;
        this.stateChangesDispatcher = new StateChangesDispatcher(this);
        this.compositeBehaviour = new CompositeBehaviour(this);
    }

    /**
     * @param childishBehaviour {ChildishBehaviour}
     */
    set childishBehaviour(childishBehaviour) {
        childishBehaviour.childComp = this;
        this._childishBehaviour = childishBehaviour;
    }

    get childishBehaviour() {
        return this._childishBehaviour;
    }

    /**
     * @param parentState
     * @return {boolean}
     */
    copyMyState(parentState) {
        if (this._childishBehaviour) {
            this._childishBehaviour.copyChildState(parentState);
        }
    }

    /**
     * shorthand method: calls doWithState with the provided stateChange
     *
     * @param stateChange {StateChange}
     * @param [dontRecordStateEvents] {boolean}
     * @return {Promise<StateChange[]>}
     */
    processStateChange(stateChange, dontRecordStateEvents) {
        return this.doWithState((basicState) => basicState.collectStateChange(stateChange, dontRecordStateEvents));
    }

    /**
     * @param [stateChanges] {StateChange[]}
     * @param [applyChangesStartingFromNewest] {boolean}
     * @return {Promise<StateChange[]>}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest) {
        return this.stateChangesDispatcher.updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest);
    }

    /**
     * component initializer: (re)load state, update the view, configure events then init kids
     *
     * @param [config] {ComponentInitConfig}
     * @return {Promise<StateChange[]>}
     */
    init(config = new ComponentInitConfig()) {
        AssertionUtils.isNullOrEmpty(this.compositeBehaviour.childComponents,
            `${this.constructor.name}.init: childComponents is not empty!`);
        return this._reloadState()
            .then(() => this.updateViewOnStateChanges())
            .then((stateChanges) => {
                this.configureEvents();
                return this.compositeBehaviour.init().then(() => stateChanges);
            })
            .catch((err) => {
                if (!config.dontConfigEventsOnError) {
                    // jqXHR is missing finally, so, if we would need to configureEvents
                    // on errors too, we would have to use catch anyway
                    this.configureEvents();
                }
                throw err;
            });
    }

    /**
     * Reloading the state from somewhere (e.g. a repository).
     *
     * @return {Promise<*>}
     * @protected
     */
    _reloadState() {
        return Promise.resolve();
    }

    /**
     * @protected
     */
    configureEvents() {
        // do nothing
    }

    /**
     * brings the component to the state existing at its creation
     */
    reset() {
        this.compositeBehaviour.reset();
        if (this.view.$elem) {
            this.view.$elem.off(this._eventsNamespace);
        }
        this.view.reset();
        this.state.reset();
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param stateUpdaterFn {function(state: BasicState)}
     * @param delayViewUpdate {boolean} whether to (immediately) update the view based or not
     * @return {Promise<StateChange[]>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate = false) {
        console.log(`${this.constructor.name}.doWithState: delayViewUpdate = ${delayViewUpdate}`);
        stateUpdaterFn(this.state);
        if (delayViewUpdate) {
            return Promise.resolve(this.state.peekAll());
        }
        return this.updateViewOnStateChanges();
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     * When this.extractInputValues exists than this.extractEntity must use it instead of using super.extractEntity!
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields) {
        const inputValues = this.extractInputValues(useOwnerOnFields);
        return EntityUtils.removeTransientId(inputValues);
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner must be is
     * used for the parent fields otherwise useOwnerOnFields value considered.
     *
     * When this.extractAllInputValues exists than this.extractAllEntities
     * must use it instead of using super.extractAllEntities!
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
     */
    extractInputValues(useOwnerOnFields) {
        if (useOwnerOnFields == null) {
            useOwnerOnFields = this.compositeBehaviour.hasKids();
        }
        const item = this.view.extractInputValues(useOwnerOnFields);
        this.compositeBehaviour.copyKidsState(item);
        return item;
    }

    /**
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnKnownStateChange(stateChange) {
        throw `${this.constructor.name}.updateViewOnKnownStateChange is not implemented!`;
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        return this.view.update(stateChange)
            .then(() => this.compositeBehaviour.processStateChangeWithKids(stateChange));
    }

    updateViewOnERROR(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnERROR:\n${JSON.stringify(stateChange)}`);
        return Promise.resolve(stateChange);
    }

    /**
     * (internal) errors handler
     *
     * @param promise {Promise}
     * @return {Promise}
     * @protected
     */
    _handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus) => {
            console.log(`${this.constructor.name}._handleRepoErrors`);
            if (jqXHR instanceof SimpleError) {
                alert(jqXHR.message);
                throw jqXHR;
            } else {
                alert(`textStatus = ${textStatus}${jqXHR.responseText ? ', responseText:\n' + jqXHR.responseText : ''}`);
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
     * @param btnNames {string[]|string}
     * @param [dontUseOwner] {boolean}
     * @return {string} a selector e.g. [data-owner='personsTable'][data-btn='reload']
     * @protected
     */
    _btnSelector(btnNames, dontUseOwner) {
        if (!$.isArray(btnNames)) {
            btnNames = [btnNames];
        }
        return btnNames.map(name => `${this._ownerSelector}[data-btn='${name}']`).join();
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