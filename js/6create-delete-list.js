$(() => {
    const DOGS = DbMocks.DOGS;
    DOGS[0] = {id: 1, name: "dog1", person: DbMocks.PERSONS_REPOSITORY.getById(1, true)};

    // by default on creation the row is prepended to table
    const newItemsGoLast = true;

    // dogs table
    const createDeleteList = CreateDeleteListFactory.create("dogsTable", {
        items: DOGS,
        newItemsGoLast,
        bodyRowTmplId: "dogsTableRowTmpl",
    });

    // some doWithState operations on createDeleteList
    createDeleteList
        .init()
        .then(() => createDeleteList.doWithState((state) => {
            /**
             * @type {CrudListState}
             */
            const crudListState = state;
            crudListState.insertItem({
                id: EntityUtils.generateId(),
                name: "new dog"
            });
            crudListState.updateItem({id: 3, name: `updated dog3`});
            crudListState.removeById(2);
            crudListState.insertItem({
                id: 2,
                name: `restored dog2 with ${newItemsGoLast ? "append" : "prepend"}`
            });
        }))
        // showing the entire table extracted data
        .then(() => console.log("ElasticListComponent.extractAllEntities:\n",
            createDeleteList.extractAllEntities()));
});
