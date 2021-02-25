/**
 * this encapsulates the "component composition" capability of a component
 */
class CompositeBehaviour {
    /**
     * @type {AbstractComponent}
     */
    parentComp;
    /**
     * @type {ChildComponentFactory[]}
     */
    childComponentFactories = [];
    /**
     * @type {AbstractComponent[]}
     */
    childComponents = [];

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    /**
     * @param {function(parentComp: AbstractComponent): AbstractComponent|Array<function(parentComp: AbstractComponent): AbstractComponent>|ChildComponentFactory|ChildComponentFactory[]} childCompFactory
     */
    addChildComponentFactory(childCompFactory) {
        if ($.isArray(childCompFactory)) {
            childCompFactory.forEach(it => this.addChildComponentFactory(it));
        } else if (typeof childCompFactory === "function") {
            this.childComponentFactories.push($.extend(new ChildComponentFactory(), {
                createChildComponent: childCompFactory
            }));
        } else {
            this.childComponentFactories.push(childCompFactory);
        }
    }

    /**
     * @param childComp {AbstractComponent|AbstractComponent[]}
     */
    addChildComponent(childComp) {
        if ($.isArray(childComp)) {
            childComp.forEach(it => this.childComponents.push(it));
        } else {
            this.childComponents.push(childComp);
        }
    }

    /**
     * entityExtractor._extractInputValues -> compositeBehaviour.copyKidsState -> kid.copyMyState -> kid._childishBehaviour.copyChildState
     *
     * @param parentState
     */
    copyKidsState(parentState) {
        this.childComponents.forEach(kid => kid.copyMyState(parentState));
    }

    /**
     * @return {boolean} whether has component specifications or not
     */
    hasKids() {
        return this.childComponents.length > 0;
    }

    /**
     * Extracts the child state from @param stateChange as a
     * child-related-StateChange then apply it to the child component.
     *
     * This works fine if @param stateChange contains all child related
     * data otherwise a kid might not know whether its state was cleared
     * or is just missing from the @param stateChange.
     *
     * todo: cope with @param parentState missing some children state
     * todo: cope with stateChange.requestType not handleable by some children
     *
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.extractChildState
     *
     * @param stateChange {StateChange}
     * @param [kidsFilter] {function(kid: AbstractComponent): boolean} filter the kids interested in the state change
     * @param [stateChangeKidAdapter] {function(kid: AbstractComponent): StateChange}
     * @return {Promise<StateChange[]>}
     */
    processStateChangeWithKids(stateChange,
                               kidsFilter = (kid) => !!kid.childishBehaviour,
                               stateChangeKidAdapter = (kid) => this._extractChildState(stateChange, kid)) {
        const promises = this.childComponents.filter(kidsFilter).map(kidComp => {
            const kidStateChange = stateChangeKidAdapter(kidComp);
            // ignore undefined kidStateChange: means that the parent is missing the child, so probably doesn't intend to update it
            if (kidStateChange === undefined) {
                return undefined;
            }
            return kidComp.processStateChange(kidStateChange);
        });
        return Promise.allSettled(promises.filter((it) => it !== undefined));
    }

    /**
     * @param stateChange {StateChange}
     * @param kid {AbstractComponent}
     * @return {StateChange}
     * @protected
     */
    _extractChildState(stateChange, kid) {
        if (kid.childishBehaviour) {
            const kidState = kid.childishBehaviour.extractChildState(stateChange.data);
            // ignore undefined kidState: means that the parent is missing the child, so probably doesn't intend to update it
            if (kidState === undefined) {
                return undefined;
            }
            return $.extend(true, new StateChange(), stateChange, {data: kidState});
        } else {
            return kid.state.currentState;
        }
    }

    /**
     * @param kidsFilter {function(kid: AbstractComponent): boolean}
     * @return {AbstractComponent[]}
     */
    findKids(kidsFilter) {
        return this.childComponents.filter(kidsFilter);
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner must be is
     * used for the parent fields otherwise useOwnerOnFields value considered.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.childComponents.map((kid) => {
            try {
                return kid.extractEntity(useOwnerOnFields);
            } catch (e) {
                if (e === EntityExtractor.EXTRACT_ENTITY_UNSUPPORTED) {
                    return kid.extractAllEntities(useOwnerOnFields);
                }
                throw e;
            }
        });
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllInputValues(useOwnerOnFields) {
        return this.childComponents.map((kid) => kid.extractInputValues(useOwnerOnFields));
    }

    /**
     * create the child component then init it
     *
     * @return {Promise<StateChange[]>}
     */
    init() {
        this.childComponents = this._createChildComponents();
        const promises = this._initChildComponents();
        return Promise.allSettled(promises);
    }

    /**
     * @return {Promise<StateChange[]>[]}
     * @protected
     */
    _initChildComponents() {
        return this.childComponents.map(kid => kid.init());
    }

    /**
     * @return {AbstractComponent[]}
     * @protected
     */
    _createChildComponents() {
        return this.childComponentFactories.map(compFactory => compFactory.createChildComponent(this.parentComp));
    }

    /**
     * childComponentFactories is "configuration" that's why is not cleared
     *
     * @param {boolean} [clearChildren]
     */
    reset(clearChildren) {
        this.childComponents.forEach(kid => kid.reset());
        if (clearChildren) {
            this.childComponents = [];
        }
    }
}