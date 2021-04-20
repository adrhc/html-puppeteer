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
    // .then(() => selectableList.doWithState((state) => {
    //     /**
    //      * @type {SelectableListState}
    //      */
    //     const selectableListState = state;
    //     selectableListState.createNewItem({
    //         name: `new dog (with table ${rowPositionOnCreate})`
    //     }, rowPositionOnCreate === "append");
    //     selectableListState.updateItem({id: 3, name: "updated dog3"});
    //     selectableListState.removeById(2);
    //     selectableListState.insertItem({
    //         id: 2,
    //         name: `restored dog2 (with table ${rowPositionOnCreate})`
    //     }, rowPositionOnCreate === "append");
    // }));
});