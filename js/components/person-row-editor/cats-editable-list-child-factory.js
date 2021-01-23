class CatsEditableListChildFactory extends ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createChildComponent(parentComp) {
        const $catsTable = $("[data-id='catsTable']", parentComp.view.$elem);
        const catRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: $catsTable,
            rowTmplId: "editableCatsRowTmpl",
            tableRelativePositionOnCreate: "append"
        });

        // parentComp.state is {SimpleRowState}
        const repository = new InMemoryCrudRepository($.extend(true, [], parentComp.state.rowState.cats));

        // cats table component
        return EditableListFactory.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository, true),
            tableIdOrJQuery: $catsTable,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow,
            // EditableListComponent.extractEntity (aka SelectableListComponent.extractEntity)
            // is using selectedRow to extract the entity while we need to extract all of them
            // (i.e. AbstractTableBasedComponent extractEntity/extractAllEntities behaviour).
            childishBehaviour: new DefaultTableChildishBehaviour(parentComp, "cats")
        });
    }
}