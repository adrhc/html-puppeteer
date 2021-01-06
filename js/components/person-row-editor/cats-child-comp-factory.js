class CatsChildCompFactory extends ChildComponentFactory {
    constructor() {
        super("[data-id='catsTable']");
    }

    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        const $parentElem = this._childOf(parentComp);
        const catRow = SimpleRowFactory.prototype.createIdentifiableRow(
            $parentElem, {
                rowTmpl: "editableCatsRowTmpl", tableRelativePositionOnCreate: "append"
            });

        const catsChildOperations = new ChildComponent(undefined, parentComp);
        catsChildOperations.updateParentState = (parentState) => {
            // catsChildOperations.myComp is {EditableListComponent}
            parentState.cats = catsChildOperations.myComp.extractAllEntities(true);
            return true;
        }

        // parentComp.state is {SimpleRowState}
        const repository = new InMemoryCrudRepository(new EntityHelper(),
            $.extend(true, [], parentComp.state.rowState.cats));

        return EditableListFactory.prototype.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository),
            tableId: $parentElem,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow,
            childComponent: catsChildOperations
        });
    }
}