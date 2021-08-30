// dogs table with editable row
const dogsTableWithEdit = "dogsTableWithEdit";

/**
 * @param {*} [initialData]
 * @return {IdentifiableRowComponent}
 */
function createDogsWithEditRow(initialData) {
    return new IdentifiableRowComponent({
        elemIdOrJQuery: dogsTableWithEdit,
        bodyRowTmplId: `${dogsTableWithEdit}SelectedRowTmpl`,
        initialState: initialData ? new EntityRow(initialData, {append: true}) : undefined
    });
}

const dogsTableWithDelete = "dogsTableWithDelete";

/**
 * @param {*} [initialData]
 * @return {IdentifiableRowComponent}
 */
function createDogsWithDeleteRow(initialData) {
    return new IdentifiableRowComponent({
        elemIdOrJQuery: dogsTableWithDelete,
        bodyRowTmplId: `${dogsTableWithDelete}SpecialRowTmpl`,
        initialState: initialData ? new EntityRow(initialData, {append: true}) : undefined
    });
}

$(() => {
    const simpleListComponent = new SimpleListComponent({
        elemIdOrJQuery: dogsTableWithEdit,
        bodyRowTmplId: "readOnlyRowTmpl",
        items: DbMocks.dogsOf(3),
    });
    const simpleListTableAdapter = simpleListComponent.tableBasedView.tableAdapter;
    simpleListComponent.init().then(stateChanges => {
        const items = stateChanges[0].newStateOrPart;
        const item0 = items[0];
        const item2 = items[2];
        const rowId0 = createDogsWithEditRow(item0);
        return rowId0.init().then(() => {
            // here editableRow.view.$elem is not initialized
            const extractedEntity = rowId0.extractEntity();
            AssertionUtils.isNull(extractedEntity, "extractedEntity != null");
        }).then(() => {
            // besides updating the row representation this also initializes editableRow.view.$elem
            return rowId0.update(new EntityRow({id: item0.id, name: `${item0.name}-updated (position retained)`}));
        }).then(() => {
            const extractedEntity = rowId0.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"0\",\"name\":\"dog 0-updated (position retained)\"}");
        }).then(() => {
            // creating a new row
            const transientRow = createDogsWithEditRow();
            return transientRow
                .update(new EntityRow({
                    id: IdentifiableEntity.TRANSIENT_ID,
                    name: `TRANSIENT dog (after row0)`
                }, {afterRowId: simpleListComponent.simpleListState.items[0].id}))
                .then(() => transientRow);
        }).then((transientRow) => {
            const extractedEntity = transientRow.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"name\":\"TRANSIENT dog (after row0)\"}");
        }).then(() => {
            // creating a new row (current state is undefined hence state.index is undefined too)
            const row777 = createDogsWithEditRow();
            return row777.update({
                entity: {
                    id: 777,
                    name: `new dog (id = 777, before the transient row)`
                },
                index: 1, // any than undefined would trigger the usage of beforeRowId (because will differ than the current state index)
                beforeRowId: IdentifiableEntity.TRANSIENT_ID
            }).then(() => row777);
        }).then((rowId777) => {
            const extractedEntity = rowId777.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"777\",\"name\":\"new dog (id = 777, before the transient row)\"}");
        }).then(() => {
            const row888 = createDogsWithEditRow(item2);
            return row888
                .update(new EntityRow({id: 888, name: `${item2.name} id (${item2.id}) changed to 888`}))
                .then(() => row888);
        }).then((rowId888) => {
            const extractedEntity = rowId888.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"888\",\"name\":\"dog 2 id (2) changed to 888\"}");
        }).then(() => {
            // creating a new row
            const row999 = createDogsWithEditRow();
            return row999.update(new EntityRow(
                {id: 999, name: `new dog (id = 999, appended)`},
                {append: true}
            )).then(() => row999);
        }).then((rowId999) => {
            const extractedEntity = rowId999.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"999\",\"name\":\"new dog (id = 999, appended)\"}");
            const lastRow = simpleListTableAdapter.$getAllRows().last();
            AssertionUtils.isTrue(lastRow[0] === rowId999.view.$elem[0]);
        }).then(() => {
            // creating a new row
            const row555 = createDogsWithEditRow();
            return row555.update(new EntityRow(
                {id: 555, name: `new dog (id = 555, prepended)`},
                {append: false}
            )).then(() => row555);
        }).then((row555) => {
            const extractedEntity = row555.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"555\",\"name\":\"new dog (id = 555, prepended)\"}");
            const firstRow = simpleListTableAdapter.$getAllRows().first();
            AssertionUtils.isTrue(firstRow[0] === row555.view.$elem[0]);
        });
    });

    // dogs table with deleted row
    /*new SimpleListComponent({
        elemIdOrJQuery: dogsTableWithDelete,
        bodyRowTmplId: "readOnlyRowTmpl",
        items: DbMocks.dogsOf(3)
    }).then(stateChanges => {
        const items = stateChanges[0].newStateOrPart;
        const item0 = items[0];
        const rowId0 = createDogsWithDeleteRow(item0);
        // switching to "simpleRow" display type (i.e. line-through text style)
        return rowId0.remove()
            .then(() => {
                const $tr1 = $(`#${dogsTableWithDelete} tr[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${dogsTableWithDelete}'][data-id='${item0.id}']`);
                AssertionUtils.isFalse(!!$tr1.length);
            })
            // rendering the "delete" representation
            .then(() => rowId0.update(new EntityRow(item0, {index: 1})))
    });*/

});
