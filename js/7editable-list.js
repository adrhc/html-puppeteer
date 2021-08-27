$(() => {
    const elemIdOrJQuery = "dogsTable";

    const component = new EditableListComponent({
        elemIdOrJQuery,
        dontAutoInitialize: true
    });

    return component
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
        }));
});
