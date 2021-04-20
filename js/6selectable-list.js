const JSONs = {
    "append": "[{\"id\":\"1\",\"name\":\"dog1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog (with append)\"},{\"id\":\"2\",\"name\":\"restored dog2 (with append)\"}]"
}

$(() => {
    // dogs table with both read-only and editable row
    const rowPositionOnCreate = "append";
    const elemIdOrJQuery = "dogsTable";

    const selectableList = new SelectableListComponent({
        elemIdOrJQuery,
        items: DbMocks.DOGS,
        offRow: new IdentifiableRowComponent({elemIdOrJQuery, rowPositionOnCreate}),
        onRow: new IdentifiableRowComponent({elemIdOrJQuery, bodyRowTmplId: "dogsTableEditableRowTmpl"}),
        dontAutoInitialize: true
    });

    selectableList
        .init()
        .then(() => selectableList.doWithState(() => {
            const selectableListState = selectableList.selectableListState;
            selectableListState.createNewItem({
                name: `new dog (with ${rowPositionOnCreate})`
            }, rowPositionOnCreate === "append");
            selectableListState.updateItem({id: 3, name: "updated dog3"});
            selectableListState.removeById(2);
            selectableListState.insertItem({
                id: 2,
                name: `restored dog2 (with ${rowPositionOnCreate})`
            }, rowPositionOnCreate === "append");
        }))
        .then(() => {
            const entities = selectableList.extractAllEntities();
            console.log("SelectableListComponent.extractAllEntities:\n", entities);
            AssertionUtils.isTrue(entities.length === 4, "entities.length === 4");
            AssertionUtils.isTrue(JSON.stringify(entities) === JSONs[rowPositionOnCreate], "entities JSON should match")
        });
});