$(() => {
    const DOGS = DbMocks.dogsOf(5);
    _.defaults(DOGS[0], {person: DbMocks.PERSONS_REPOSITORY.getById(1, true)});

    // by default on creation the row is prepended to table
    const rowPositionOnCreate = "append";

    // dogs table
    const createDeleteList = new CreateDeleteListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DOGS,
        rowPositionOnCreate,
        dontAutoInitialize: true
    });

    // some doWithState operations on createDeleteList
    createDeleteList
        .init()
        // .then(() => createDeleteList.doWithState((state) => {
        //     /**
        //      * @type {CrudListState}
        //      */
        //     const crudListState = state;
        //     crudListState.insertItem({
        //         id: EntityUtils.generateId(),
        //         name: "new dog"
        //     });
        //     crudListState.updateItem({id: 3, name: `updated dog3`});
        //     crudListState.removeById(2);
        //     crudListState.insertItem({
        //         id: 2,
        //         name: `restored dog2 with ${rowPositionOnCreate}`
        //     });
        // }))
        // showing the entire table extracted data
        .then(() => console.log("ElasticListComponent.extractAllEntities:\n",
            createDeleteList.extractAllEntities()));
});
