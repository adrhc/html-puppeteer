class CatsEditableListChildFactory extends ChildComponentFactory {
    /**
     * @param {IdentifiableRowComponent} idRowComp
     * @return {AbstractComponent}
     */
    createChildComponent(idRowComp) {
        const $catsTable = $("[data-id='catsTable']", idRowComp.view.$elem);
        const catRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: $catsTable,
            rowTmplId: "editableCatsRowTmpl",
            tableRelativePositionOnCreate: "append"
        });

        // @type {EntityRowSwap} idRowComp.state.currentState
        const repository = new InMemoryCrudRepository($.extend(true, [], idRowComp.state.currentState.entity.cats));

        // cats table component
        return EditableListFactory.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository, {newItemsGoToTheEndOfTheList: true}),
            tableIdOrJQuery: $catsTable,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow,
            // EditableListComponent.extractEntity (aka SelectableListComponent.extractEntity)
            // is using onRow to extract the entity while we need to extract all of them
            // (i.e. AbstractTableBasedComponent extractEntity/extractAllEntities behaviour).
            childishBehaviour: new DefaultTableChildishBehaviour(idRowComp, {childProperty: "cats"})
        });
    }
}