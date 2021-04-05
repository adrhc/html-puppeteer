const JSONs = {
    prepend: "[{\"id\":\"1\",\"name\":\"dog1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog with prepend\"},{\"id\":\"2\",\"name\":\"restored dog2 with prepend\"}]",
    append: "[{\"id\":\"1\",\"name\":\"dog1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog with append\"},{\"id\":\"2\",\"name\":\"restored dog2 with append\"}]"
};

$(() => {
    // dogs table with read-only row (default: on creation prepend to table)
    const components = JQWUtil.createComponents({dontAutoInitialize: true});
    _.forEach(components, (component) => {
        const rowPositionOnCreate = component.config.rowPositionOnCreate;
        component
            .init()
            .then(() => component.doWithState((state) => {
                /**
                 * @type {CrudListState}
                 */
                const crudListState = state;
                crudListState.createNewItem({name: `new dog with ${rowPositionOnCreate}`}); // transient id
                crudListState.updateItem({id: 3, name: "updated dog3"});
                crudListState.removeById(2);
                // creating a new item with a not transient id (here id=2)
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${rowPositionOnCreate}`
                });
            }))
            .then(() => {
                const entities = component.extractAllEntities(true);
                console.log("component.extractAllEntities:\n", entities);
                AssertionUtils.isTrue(entities.length === 4, "entities.length === 4");
                AssertionUtils.isTrue(JSON.stringify(entities) === JSONs[rowPositionOnCreate], "entities JSON should match")
            });
    });
});
