class CatsComponentSpec extends ChildComponentSpecification {
    constructor() {
        super("[data-id='catsTable']",
            CatsComponentSpec.createCatsTable,
            CatsComponentSpec.updateParentStateWithCats);
    }

    static updateParentStateWithCats(parentState, childComp) {
        parentState.cats = childComp.extractAllEntities(true);
        return true;
    }

    /**
     * @param $tableElem {jQuery<HTMLElement>}
     * @param parentState {SimpleRowState}
     * @return {EditableListComponent}
     */
    static createCatsTable($tableElem, parentState) {
        const catRow = SimpleRowFactory.prototype.createIdentifiableRow(
            $tableElem, {
                rowTmpl: "editableCatsRowTmpl", tableRelativePositionOnCreate: "append"
            });

        const repository = new InMemoryCrudRepository(new EntityHelper(),
            $.extend(true, [], parentState.rowState.cats));

        return EditableListFactory.prototype.create({
            repository,
            // CatsListState cancels swapping events so there's no need for editableRow and deletableRow
            state: new CatsListState(repository),
            tableId: $tableElem,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: catRow
        });
    }
}