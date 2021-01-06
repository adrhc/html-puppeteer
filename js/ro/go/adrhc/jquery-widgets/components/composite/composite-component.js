class CompositeComponent {
    /**
     * @type {AbstractComponent}
     */
    parentComp;
    /**
     * @type {ChildComponentSpecification[]}
     */
    componentSpecs = []
    /**
     * Array[0] is {AbstractComponent}
     * Array[1] is {ChildComponentSpecification}
     *
     * @type {Array[]}
     */
    componentsAndSpecs = []

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    /**
     * @param compSpec {ChildComponentSpecification|ChildComponentSpecification[]}
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
        this.componentsAndSpecs.forEach(compAndSpec => {
            result.existsChange = result.existsChange ||
                compAndSpec[1].updateParentState(parentState, compAndSpec[0]);
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
        this.componentsAndSpecs = this.componentSpecs.map(cmpSpec => [cmpSpec.createComp(this.parentComp), cmpSpec]);
        const promises = this.componentsAndSpecs.map(compAndSpec => compAndSpec[0].init());
        return Promise.allSettled(promises);
    }

    close() {
        this.componentsAndSpecs.forEach(compAndSpec => compAndSpec[0].close());
    }
}