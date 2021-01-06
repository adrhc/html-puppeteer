class CatsComponentSpec extends ChildComponentSpecification {
    constructor() {
        super("[data-id='catsTable']",
            CatsComponentSpec.updateParentStateWithCats);
    }

    static updateParentStateWithCats(parentState, childComp) {
        parentState.cats = childComp.extractAllEntities(true);
        return true;
    }

    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        const $parentElem = this._childOf(parentComp.view.$elem);
        const catRow = SimpleRowFactory.prototype.createIdentifiableRow(
            $parentElem, {
                rowTmpl: "editableCatsRowTmpl", tableRelativePositionOnCreate: "append"
            });

        // parentComp.state is {SimpleRowState}
        const repository = new InMemoryCrudRepository(new EntityHelper(),
            $.extend(true, [], parentComp.state.rowState.cats));

        return EditableListFactory.prototype.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository),
            tableId: $parentElem,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow
        });
    }
}