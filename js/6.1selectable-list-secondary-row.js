const JSONs = {
    "append": "[{\"id\":\"0\",\"name\":\"dog 0\"},{\"id\":\"1\",\"name\":\"dog 1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"id\":\"4\",\"name\":\"dog 4\"},{\"id\":\"5\",\"name\":\"dog 5\"},{\"id\":\"6\",\"name\":\"dog 6\"},{\"id\":\"7\",\"name\":\"dog 7\"},{\"id\":\"8\",\"name\":\"dog 8\"},{\"id\":\"9\",\"name\":\"dog 9\"},{\"name\":\"new dog (with append)\"},{\"id\":\"2\",\"name\":\"restored dog2 (with append)\"}]"
}

$(() => {
    // dogs table with both read-only and editable row
    const elemIdOrJQuery = "dogsTable";

    const selectableList = new SelectableListComponent({
        elemIdOrJQuery,
        onRow: new IdentifiableRowComponent({
            elemIdOrJQuery,
            bodyRowTmplId: "dogsTableEditableRowTmpl"
        }),
        dontAutoInitialize: true
    });

    const rowPositionOnCreate = selectableList.simpleListConfiguration.rowPositionOnCreate;

    selectableList
        .init()
        .then(() => selectableList.doWithState(() => {
            const selectableListState = selectableList.selectableListState;
            selectableListState.createNewItem({
                name: `new dog (with ${rowPositionOnCreate})`
            }, {append: rowPositionOnCreate === "append"});
            selectableListState.updateItem({id: 3, name: "updated dog3"});
            selectableListState.removeById(2);
            selectableListState.insertItem({
                id: 2,
                name: `restored dog2 (with ${rowPositionOnCreate})`
            }, {append: rowPositionOnCreate === "append"});
        }))
        .then(() => {
            const entities = selectableList.extractAllEntities();
            console.log("SelectableListComponent.extractAllEntities:\n", entities);
            AssertionUtils.isTrue(entities.length === 11, "entities.length === 11");
            AssertionUtils.isTrue(JSON.stringify(entities) === JSONs[rowPositionOnCreate], "entities JSON should match")
        });
});