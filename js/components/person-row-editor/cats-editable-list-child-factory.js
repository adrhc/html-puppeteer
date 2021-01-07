class CatsEditableListChildFactory extends ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        const $parentElem = $("[data-id='catsTable']", parentComp.view.$elem);
        const catRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: $parentElem,
            rowTmpl: "editableCatsRowTmpl",
            tableRelativePositionOnCreate: "append"
        });

        const catsChildOperations = new ChildComponent(parentComp);
        catsChildOperations.copyKidState = (parentState) => {
            // catsChildOperations.kidComp is {EditableListComponent} = cats table component
            // kidComp means "me/this/current" relative to ChildComponent
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
            tableIdOrJQuery: $parentElem,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow,
            childComponent: catsChildOperations
        });
    }
}