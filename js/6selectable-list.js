$(() => {
    // dogs table with both read-only and editable row
    const elemIdOrJQuery = "dogsTable";
    const tableRelativePositionOnCreate = "append";
    const append = tableRelativePositionOnCreate === "append";

    const offRow = SimpleRowFactory.createIdentifiableRow(
        {
            elemIdOrJQuery, tableRelativePositionOnCreate
        });
    const onRow = SimpleRowFactory.createIdentifiableRow(
        {
            elemIdOrJQuery, rowTmplId: "dogsTableEditableRowTmpl"
        });

    const selectableList = SelectableListFactory.create(elemIdOrJQuery, {
        items: DbMocks.DOGS, offRow, onRow
    });

    selectableList
        .init()
        .then(() => selectableList.doWithState((state) => {
            /**
             * @type {SelectableListState}
             */
            const selectableListState = state;
            selectableListState.createNewItem({
                name: `new dog (with table ${tableRelativePositionOnCreate})`
            }, append);
            selectableListState.updateItem({id: 3, name: "updated dog3"});
            selectableListState.removeById(2);
            selectableListState.insertItem({
                id: 2,
                name: `restored dog2 (with table ${tableRelativePositionOnCreate})`
            }, append);
        }));
});