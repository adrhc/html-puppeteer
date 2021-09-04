class SelectableListEntityExtractor extends DefaultEntityExtractor {
    /**
     * @type {SelectableListComponent}
     */
    get selectableList() {
        return this.component;
    }

    /**
     * Returns the IdentifiableRowComponent dealing with an "active" selection.
     * The specific row though depend on the EntityRowSwap.context if
     * present otherwise is the this.swappingRowSelector[false].
     *
     * @return {IdentifiableRowComponent} responsible for the currently "selected" row
     */
    get selectedRowComponent() {
        const entityRowSwap = this.selectableList.selectableListState.currentEntityRowSwap;
        if (!entityRowSwap) {
            return undefined;
        }
        const context = entityRowSwap.context ?? SwitchType.ON;
        return this.selectableList.swappingRowSelector[context];
    }

    constructor(component, {
        dontRemoveGeneratedId,
        entityConverterFn = (it) => it
    } = {
        entityConverterFn(it) {
            return it;
        }
    }) {
        super(component, {dontRemoveGeneratedId, entityConverterFn});
    }

    /**
     * This could be considered the extracted-entity behaviour of the component or a new behaviour.
     * To abey the Liskov Substitution Principle principle (see SOLID principles) I consider this new behaviour.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
     */
    extractSelectedEntity(useOwnerOnFields) {
        const onRow = this.selectedRowComponent;
        return onRow ? this.entityConverterFn(onRow.extractEntity(useOwnerOnFields)) : undefined;
    }

    extractEntity(useOwnerOnFields) {
        return this.extractSelectedEntity();
    }
}