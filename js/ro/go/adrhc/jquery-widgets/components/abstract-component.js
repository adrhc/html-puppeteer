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
     * @type {CompositeComponent}
     */
    compositeComponent;
    /**
     * see this as the "child component" capability of the current/this component
     *
     * @type {ChildComponent}
     */
    _childComponent;

    /**
     * @param childComponent {ChildComponent}
     */
    set childComponent(childComponent) {
        childComponent.kidComp = this;
        this._childComponent = childComponent;
    }

    /**
     * @param parentState
     * @return {boolean}
     */
    copyMyState(parentState) {
        return this._childComponent && this._childComponent.copyKidState(parentState);
    }

    /**
     * @param state {BasicState}
     * @param view {AbstractView}
     */
    constructor(state, view) {
        this.state = state;
        this.view = view;
        this.stateChangesDispatcher = new StateChangesDispatcher(this);
        this.compositeComponent = new CompositeComponent(this);
    }

    /**
     * @param childCompFactory {ChildComponentFactory|ChildComponentFactory[]}
     */
    addChildComponentFactory(childCompFactory) {
        this.compositeComponent.addChildComponentFactory(childCompFactory);
    }

    /**
     * @param childComp {AbstractComponent|AbstractComponent[]}
     */
    addChildComponent(childComp) {
        this.compositeComponent.addChildComponent(childComp);
    }

    /**
     * @param parentState
     * @return {boolean} whether an update occured or not
     */
    copyKidsState(parentState) {
        return this.compositeComponent.copyKidsState(parentState);
    }

    /**
     * @return {Promise<[]>}
     */
    initKids() {
        return this.compositeComponent.init();
    }

    /**
     * @param stateChange {StateChange}
     * @param kidsFilter {function(comp: AbstractComponent): boolean}
     * @param removeAfterProcessing {boolean}
     * @return {Promise<StateChange[][]>}
     */
    processKids(stateChange, kidsFilter, removeAfterProcessing) {
        return this.compositeComponent.process(stateChange, kidsFilter, removeAfterProcessing)
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange[]>}
     */
    process(stateChange) {
        return this.doWithState((basicState) => basicState.collectStateChange(stateChange));
    }

    /**
     * @param stateChanges {StateChange[]|undefined}
     * @param applyChangesStartingFromLatest {boolean|undefined}
     * @return {Promise<StateChange[]>}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromLatest) {
        return this.stateChangesDispatcher.updateViewOnStateChanges(stateChanges, applyChangesStartingFromLatest);
    }

    /**
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnStateChange(stateChange) {
        return this.stateChangesDispatcher.updateViewOnStateChange(stateChange);
    }

    /**
     * component initializer: (re)load state, update the view, configure events
     * kids could be initialized only when the state is (re)loaded
     *
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return this.updateViewOnStateChanges();
    }

    close() {
        this.compositeComponent.close();
        if (this.view.$elem) {
            this.view.$elem.off(this._eventsNamespace);
        }
        this.state.reset();
        this.view.reset();
    }

    /**
     * Offer the state for manipulation then update the view.
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
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
     */
    extractInputValues(useOwnerOnFields) {
        if (useOwnerOnFields == null) {
            useOwnerOnFields = this.compositeComponent.hasKids();
        }
        const item = this.view.extractInputValues(useOwnerOnFields);
        this.copyKidsState(item);
        return item;
    }

    /**
     * @param stateChange {StateChange|undefined}
     * @return {Promise<StateChange>}
     */
    updateViewOnKnownStateChange(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnKnownStateChange:\n${JSON.stringify(stateChange)}`);
        throw "Not implemented!";
    }

    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
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
                console.log(`${this.constructor.name} errorThrown: ${errorThrown}`);
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