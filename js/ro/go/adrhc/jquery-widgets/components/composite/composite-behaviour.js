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
     * @param stateChange {StateChange}
     * @param [kidsFilter] {function(kid: AbstractComponent): boolean} filter the kids interested in the state change
     * @param [stateChangeKidAdapter] {function(kid: AbstractComponent): StateChange}
     * @return {Promise<StateChange[]>}
     */
    processStateChangeWithKids(stateChange,
                               kidsFilter = () => true,
                               stateChangeKidAdapter = () => stateChange) {
        const promises = this.childComponents.filter(kidsFilter).map(kidComp => {
            const stateChangeKidPart = stateChangeKidAdapter(kidComp);
            return kidComp.processStateChange(stateChangeKidPart);
        });
        return Promise.allSettled(promises);
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
     * When this.extractAllInputValues exists than this.extractAllEntities
     * must use it instead of using super.extractAllEntities!
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.extractAllInputValues(useOwnerOnFields).map(iv => EntityUtils.removeTransientId(iv));
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
     * @return {Promise<Array<StateChange>[]>}
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
        if (this.childComponentFactories.length) {
            return this.childComponentFactories.map(compFactory => compFactory.createChildComponent(this.parentComp));
        } else {
            return this.childComponents;
        }
    }

    /**
     * childComponentFactories is "configuration" that's why is not cleared
     */
    reset() {
        this.childComponents.forEach(kid => kid.reset());
        this.childComponents = [];

    }
}