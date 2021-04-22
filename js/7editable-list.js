$(() => {
    const elemIdOrJQuery = "dogsTable";

    const component = new EditableListComponent({
        elemIdOrJQuery,
        items: DbMocks.DOGS,
        dontAutoInitialize: true
    });

    return component
        .init()
        .then(() => component.doWithState((state) => {
            /**
             * @type {CrudListState}
             */
            const crudListState = state;
            crudListState.updateItem({id: 3, name: "component only (not repository) updated dog3"});
            crudListState.removeById(2);
            crudListState.insertItem({
                id: 2,
                name: `component only (not repository) restored dog2 (using append)`
            }, true);
            crudListState.insertItem({
                id: 4,
                name: `component only (not repository) added dog4 (using prepend)`
            }, false);
            crudListState.insertItem({
                id: 5,
                name: `component only (not repository) added dog5 (using append)`
            }, true);
        }));
});
