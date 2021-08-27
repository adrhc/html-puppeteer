$(() => {
    const elemIdOrJQuery = "dogsTable";

    const component = new EditableListComponent({
        elemIdOrJQuery,
        bodyRowTmplId: "dogsTableRowTmpl",
        offRow: new IdentifiableRowComponent({
            elemIdOrJQuery,
            bodyRowTmplId: "dogsTableRowTmpl"
        }),
        onRow: new IdentifiableRowComponent({
            elemIdOrJQuery,
            bodyRowTmplId: "dogsTableEditableRowTmpl"
        }),
        deletableRow: new IdentifiableRowComponent({
            elemIdOrJQuery,
            bodyRowTmplId: "dogsTableDeletableRowTmpl"
        }),
        errorRow: new IdentifiableRowComponent({
            elemIdOrJQuery,
            bodyRowTmplId: "dogsTableErrorRowTmpl"
        }),
        dontAutoInitialize: true
    });

    component
        .init()
        .then(() => component.doWithState((state) => {
            /**
             * @type {EditableListState}
             */
            const editableListState = state;
            editableListState.removeById(2);
            editableListState.insertItem({
                id: 2,
                name: `restored (NOT IN REPOSITORY YET, lost on reload) dog2 with position/index changed using append`
            }, {append: true});
            editableListState.updateItem({
                id: 3,
                name: "updated (NOT IN REPOSITORY YET, lost on reload) dog3 (position/index not changed)"
            });
            editableListState.updateItem({
                id: 4,
                name: `changed (NOT IN REPOSITORY YET, lost on reload) dog4 position/index using prepend`
            }, {append: false});
            editableListState.updateItem({
                id: 5,
                name: `changed (NOT IN REPOSITORY YET, lost on reload) dog5 position/index using append`
            }, {append: true});
            editableListState.createNewItem({
                id: 11,
                name: `created (NOT IN REPOSITORY YET, lost on reload) dog11 position/index using default`
            });
        }))
        .then(() => {
            const entities = component.extractAllEntities();
            console.log("SelectableListComponent.extractAllEntities:\n", entities);
            AssertionUtils.isTrue(entities.length === 11, "entities.length must be 11!");
            AssertionUtils.isTrue(JSON.stringify(entities) === "[{\"id\":\"11\"},{\"id\":\"4\"},{\"id\":\"0\"},{\"id\":\"1\"},{\"id\":\"3\"},{\"id\":\"6\"},{\"id\":\"7\"},{\"id\":\"8\"},{\"id\":\"9\"},{\"id\":\"2\"},{\"id\":\"5\"}]",
                "Extracted entities didn't match!");
            AssertionUtils.isTrue(JSON.stringify(component.state.currentState) === "[{\"id\":11,\"name\":\"created (NOT IN REPOSITORY YET, lost on reload) dog11 position/index using default\"},{\"id\":4,\"name\":\"changed (NOT IN REPOSITORY YET, lost on reload) dog4 position/index using prepend\"},{\"id\":0,\"name\":\"dog 0\"},{\"id\":1,\"name\":\"dog 1\"},{\"id\":3,\"name\":\"updated (NOT IN REPOSITORY YET, lost on reload) dog3 (position/index not changed)\"},{\"id\":6,\"name\":\"dog 6\"},{\"id\":7,\"name\":\"dog 7\"},{\"id\":8,\"name\":\"dog 8\"},{\"id\":9,\"name\":\"dog 9\"},{\"id\":2,\"name\":\"restored (NOT IN REPOSITORY YET, lost on reload) dog2 with position/index changed using append\"},{\"id\":5,\"name\":\"changed (NOT IN REPOSITORY YET, lost on reload) dog5 position/index using append\"}]",
                "state didn't match!")
            console.log("ASSERTIONS PASSED!");
        });
});
