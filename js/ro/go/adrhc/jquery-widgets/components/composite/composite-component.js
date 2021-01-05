class CompositeComponent {
    /**
     * @type {AbstractComponent}
     */
    parentComp;
    /**
     * @type {ComponentSpecification[]}
     */
    componentSpecs = []
    /**
     * @type {AbstractComponent[]}
     */
    components = []

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    /**
     * @param compSpec {ComponentSpecification}
     */
    addComponentSpec(compSpec) {
        this.componentSpecs.push(compSpec);
    }

    /**
     * create the child component then init it
     *
     * @return {Promise<[]>}
     */
    init() {
        this.components = this.componentSpecs.map(cmpSpec => this._createComp(cmpSpec));
        const promises = this.components.map(comp => comp.init());
        return Promise.allSettled(promises);
    }

    /**
     * @param componentSpec {ComponentSpecification}
     * @protected
     */
    _$elemOf(componentSpec) {
        return $(componentSpec.elemSelector, this.parentComp.view.$elem)
    }

    /**
     * @param componentSpec {ComponentSpecification}
     * @return {AbstractComponent}
     * @protected
     */
    _createComp(componentSpec) {
        const $elem = this._$elemOf(componentSpec);
        if (typeof componentSpec.compFactory === "function") {
            return componentSpec.compFactory($elem);
        } else {
            return componentSpec.compFactory.create($elem);
        }
    }
}