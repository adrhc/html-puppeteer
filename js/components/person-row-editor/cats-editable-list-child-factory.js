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

        const childishBehaviour = new ChildishBehaviour(parentComp);
        childishBehaviour.copyChildState = (parentState) => {
            // childishBehaviour.childComp is {EditableListComponent} = cats table component
            // childComp means "me/this/current" relative to ChildishBehaviour
            parentState.cats = childishBehaviour.childComp.extractAllEntities(true);
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
            childishBehaviour
        });
    }
}