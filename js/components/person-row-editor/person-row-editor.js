class PersonRowEditor extends IdentifiableRowComponent {
    constructor(state, view) {
        super(state, view);
        this.addComponentSpec(new ChildComponentSpecification("[data-id='catsTable']",
            new CatsTableFactory(), (parentState, childComp) => {
                parentState.cats = childComp.extractAllEntities(true);
                return true;
            }));
    }

    /**
     * @param item {Person}
     * @param requestType {string|undefined}
     * @param afterItemId {number|string}
     * @return {Promise<StateChange>}
     */
    update(item, requestType, afterItemId) {
        return super.update(item, requestType, afterItemId)
            .then(stateChange => this.initKids().then(() => stateChange));
    }

    extractInputValues(useOwnerOnFields = false) {
        const item = super.extractInputValues(true);
        this.updateWithKidsState(item);
        return item;
    }
}