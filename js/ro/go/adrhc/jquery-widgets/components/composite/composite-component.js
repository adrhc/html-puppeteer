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
     * @param compSpec {ChildComponentSpecification}
     */
    addComponentSpec(compSpec) {
        this.componentSpecs.push(compSpec);
    }

    /**
     * @param parentState
     * @return {boolean} whether an update occured or not
     */
    updateWithKidsState(parentState) {
        const result = {};
        this.componentsAndSpecs.forEach(compAndSpec => {
            /**
             * @type {ChildComponentSpecification}
             */
            const compSpec = compAndSpec[1];
            if (typeof compSpec.parentStateUpdater === "function") {
                result.existsChange = result.existsChange ||
                    compSpec.parentStateUpdater(parentState, compAndSpec[0]);
            } else {
                result.existsChange = result.existsChange ||
                    compSpec.parentStateUpdater.update(parentState, compAndSpec[0]);
            }
        });
        return result.existsChange;
    }

    /**
     * create the child component then init it
     *
     * @return {Promise<[]>} array of StateChange[]
     */
    init() {
        this.componentsAndSpecs = this.componentSpecs.map(cmpSpec => [this._createComp(cmpSpec), cmpSpec]);
        const promises = this.componentsAndSpecs.map(compAndSpec => compAndSpec[0].init());
        return Promise.allSettled(promises);
    }

    /**
     * @param componentSpec {ChildComponentSpecification}
     * @protected
     */
    _$elemOf(componentSpec) {
        return $(componentSpec.elemSelector, this.parentComp.view.$elem)
    }

    /**
     * @param compSpec {ChildComponentSpecification}
     * @return {AbstractComponent}
     * @protected
     */
    _createComp(compSpec) {
        const $elem = this._$elemOf(compSpec);
        if (typeof compSpec.compFactory === "function") {
            return compSpec.compFactory($elem, this.parentComp.state);
        } else {
            return compSpec.compFactory.create($elem, this.parentComp.state);
        }
    }

    close() {
        this.componentsAndSpecs.forEach(compAndSpec => compAndSpec[0].close());
    }
}