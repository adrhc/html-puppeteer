class CatsTableFactory extends AbstractComponentFactory {
    /**
     * @param $tableElem {jQuery<HTMLElement>}
     * @param parentState {SimpleRowState}
     * @return {EditableListComponent}
     */
    create($tableElem, parentState) {
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