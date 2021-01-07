class CatsChildCompFactory extends ChildComponentFactory {
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

        const catsChildOperations = new ChildComponent(undefined, parentComp);
        catsChildOperations.copyKidState = (parentState) => {
            // catsChildOperations.kidComp is {EditableListComponent}
            parentState.cats = catsChildOperations.kidComp.extractAllEntities(true);
            return true;
        }

        // parentComp.state is {SimpleRowState}
        const repository = new InMemoryCrudRepository(new EntityHelper(),
            $.extend(true, [], parentComp.state.rowState.cats));

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