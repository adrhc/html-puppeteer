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
     * @param childCompFactory {ChildComponentFactory|ChildComponentFactory[]}
     */
    addChildComponentFactory(childCompFactory) {
        if ($.isArray(childCompFactory)) {
            childCompFactory.forEach(it => this.childComponentFactories.push(it));
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
     * updateViewOnAny -> compositeBehaviour.processStateChangeWithKids -> compositeBehaviour._extractChildState -> childishBehaviour.extractChildState
     *
     * @param stateChange {StateChange}
     * @param [kidsFilter] {function(kid: AbstractComponent): boolean} filter the kids interested in the state change
     * @param [stateChangeKidAdapter] {function(kid: AbstractComponent): StateChange}
     * @return {Promise<StateChange[]>}
     */
    processStateChangeWithKids(stateChange,
                               kidsFilter = () => true,
                               stateChangeKidAdapter = (kid) => this._extractChildState(kid, stateChange)) {
        const promises = this.childComponents.filter(kidsFilter).map(kidComp => {
            const stateChangeKidPart = stateChangeKidAdapter(kidComp);
            return kidComp.processStateChange(stateChangeKidPart);
        });
        return Promise.allSettled(promises);
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
            return $.extend(true, new StateChange(), stateChange, {data: kidState});
        } else {
            return stateChange;
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
     */
    reset() {
        this.childComponents.forEach(kid => kid.reset());
        this.childComponents = [];
    }
}