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
     * @param childCompFactory {ChildComponentFactory|ChildComponentFactory[]}
     */
    addChildComponentFactory(childCompFactory) {
        this.compositeBehaviour.addChildComponentFactory(childCompFactory);
    }

    /**
     * @param childComp {AbstractComponent|AbstractComponent[]}
     * @return {AbstractComponent|AbstractComponent[]} the childComp parameter
     */
    addChildComponents(childComp) {
        this.compositeBehaviour.addChildComponent(childComp);
        return childComp;
    }

    /**
     * @param parentState
     */
    copyKidsState(parentState) {
        return this.compositeBehaviour.copyKidsState(parentState);
    }

    /**
     * @return {Promise<Array<StateChange>[]>}
     */
    initKids() {
        return this.compositeBehaviour.init();
    }

    /**
     * shorthand method: calls doWithState with the provided stateChange
     *
     * @param stateChange {StateChange}
     * @return {Promise<StateChange[]>}
     */
    processStateChange(stateChange) {
        return this.doWithState((basicState) => basicState.collectStateChange(stateChange));
    }

    /**
     * @param [stateChanges] {StateChange[]}
     * @param [applyChangesStartingFromLatest] {boolean}
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
     * component initializer: (re)load state, update the view, configure events kids
     * could be initialized only when the state is (re)loaded and after the view is shown
     *
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        AssertionUtils.isNullOrEmpty(this.compositeBehaviour.childComponents,
            `${this.constructor.name}.init: childComponents is not empty!`);
        // reload state
        return this.updateViewOnStateChanges()
            // init kids
            .then((stateChanges) => this.initKids().then(() => stateChanges));
    }

    /**
     * brings the component to the state existing at its creation
     */
    reset() {
        this.compositeBehaviour.reset();
        if (this.view.$elem) {
            this.view.$elem.off(this._eventsNamespace);
        }
        this.state.reset();
        this.view.reset();
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
        this.copyKidsState(item);
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
            .then(() => this.processStateChangeWithKids(stateChange))
            .then(() => stateChange);
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange[][]>}
     */
    processStateChangeWithKids(stateChange) {
        return this.compositeBehaviour.processStateChangeWithKids(stateChange);
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