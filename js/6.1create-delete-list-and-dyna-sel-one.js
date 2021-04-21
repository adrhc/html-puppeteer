const JSON_RESULT = "[{\"id\":\"0\",\"name\":\"dog 0\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"friend\":{\"id\":2,\"firstName\":\"gigi2\",\"lastName\":\"kent2\",\"cats\":[]},\"cats\":[{\"id\":1,\"name\":\"cat1\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":2,\"name\":\"cat2\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":3,\"name\":\"cat3\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1}]}},{\"id\":\"1\",\"name\":\"dog 1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"id\":\"4\",\"name\":\"dog 4\"},{\"name\":\"new dog\"},{\"id\":\"2\",\"name\":\"restored dog2 with prepend\"}]";

$(() => {
    const DOGS = DbMocks.dogsOf(5);
    _.defaults(DOGS[0], {person: DbMocks.PERSONS_REPOSITORY.getById(1, true)});

    // by default on creation the row is prepended to table
    const rowPositionOnCreate = "prepend";

    // dogs table
    const createDeleteList = new CreateDeleteListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DOGS,
        rowChildCompFactories: new DynaSelOneRowChildCompFactory(
            "person", Person.parse, DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY),
        dontAutoInitialize: true,
        rowPositionOnCreate
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
                name: `restored dog2 with ${rowPositionOnCreate}`
            });
        }))
        // showing the entire table extracted data
        .then(() => {
            const entities = createDeleteList.extractAllEntities();
            console.log("ElasticListComponent.extractAllEntities:\n", entities);
            AssertionUtils.isTrue(entities.length === 6, "entities.length === 4");
            AssertionUtils.isTrue(JSON.stringify(entities) === JSON_RESULT, "JSON doesn't match!")
        });
});
