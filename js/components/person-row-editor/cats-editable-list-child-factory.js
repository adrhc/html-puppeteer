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

        const catsChildOperations = new ChildishBehaviour(parentComp);
        catsChildOperations.copyKidState = (parentState) => {
            // catsChildOperations.kidComp is {EditableListComponent} = cats table component
            // kidComp means "me/this/current" relative to ChildishBehaviour
            parentState.cats = catsChildOperations.kidComp.extractAllEntities(true);
            return true;
        }

        // parentComp.state is {SimpleRowState}
        const repository = new InMemoryCrudRepository($.extend(true, [], parentComp.state.rowState.cats));

        // cats table component
        return EditableListFactory.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository),
            tableIdOrJQuery: $catsTable,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow,
            childComponent: catsChildOperations
        });
    }
}