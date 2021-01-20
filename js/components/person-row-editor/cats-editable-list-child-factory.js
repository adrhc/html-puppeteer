class CatsEditableListChildFactory extends ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createChildComponent(parentComp) {
        const $catsTable = $("[data-id='catsTable']", parentComp.view.$elem);
        const catRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: $catsTable,
            rowTmpl: "editableCatsRowTmpl",
            tableRelativePositionOnCreate: "append"
        });

        const childishBehaviour = new DefaultTableChildishBehaviour(parentComp, "cats");

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
            childishBehaviour
        });
    }
}