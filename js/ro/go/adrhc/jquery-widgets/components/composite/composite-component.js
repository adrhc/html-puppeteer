/**
 * this encapsulates the "component composition" capability of a component
 */
class CompositeComponent {
    /**
     * @type {AbstractComponent}
     */
    parentComp;
    /**
     * @type {ChildComponentFactory[]}
     */
    componentSpecs = []
    /**
     * @type {AbstractComponent[]}
     */
    childComponents = []

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    /**
     * @param compSpec {ChildComponentFactory|ChildComponentFactory[]}
     */
    addComponentSpec(compSpec) {
        if ($.isArray(compSpec)) {
            compSpec.forEach(it => this.componentSpecs.push(it));
        } else {
            return this.componentSpecs.push(compSpec);
        }
    }

    /**
     * @param parentState
     * @return {boolean} whether an update occured or not
     */
    updateWithKidsState(parentState) {
        const result = {};
        this.childComponents.forEach(kid => {
            result.existsChange = result.existsChange || kid.updateParentState(parentState);
        });
        return result.existsChange;
    }

    /**
     * @return {boolean} whether has component specifications or not
     */
    hasComponentSpecifications() {
        return this.componentSpecs.length > 0;
    }

    /**
     * create the child component then init it
     *
     * @return {Promise<[]>} array of StateChange[]
     */
    init() {
        this.childComponents = this.componentSpecs.map(cmpSpec => cmpSpec.createComp(this.parentComp));
        const promises = this.childComponents.map(kid => kid.init());
        return Promise.allSettled(promises);
    }

    close() {
        this.childComponents.forEach(kid => kid.close());
    }
}