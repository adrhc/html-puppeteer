class SelectableListEntityExtractor extends DefaultEntityExtractor {
    /**
     * @type {SelectableListComponent}
     */
    selectableList;

    constructor(component, {
        dontRemoveGeneratedId,
        entityConverterFn = (it) => it
    } = {
        entityConverterFn(it) {
            return it;
        }
    }) {
        super(component, {dontRemoveGeneratedId, entityConverterFn});
        this.selectableList = component;
    }

    /**
     * This could be considered the extracted-entity behaviour of the component or a new behaviour.
     * To abey the Liskov Substitution Principle principle (see SOLID principles) I consider this new behaviour.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
     */
    extractSelectedEntity(useOwnerOnFields) {
        const onRow = this.selectableList.selectedRowComponent;
        return onRow ? this.entityConverterFn(onRow.extractEntity(useOwnerOnFields)) : undefined;
    }

    extractEntity(useOwnerOnFields) {
        return this.extractSelectedEntity();
    }
}