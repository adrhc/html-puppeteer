// dogs table with editable row
const dogsTable = "dogsTable";

/**
 * @param {*} [initialData]
 * @return {IdentifiableRowComponent}
 */
function createEditRow(initialData) {
    return new IdentifiableRowComponent({
        elemIdOrJQuery: dogsTable,
        bodyRowTmplId: `${dogsTable}EditableRowTmpl`,
        initialState: initialData ? new EntityRow(initialData, {append: true}) : undefined
    });
}

/**
 * @param {*} [initialData]
 * @return {IdentifiableRowComponent}
 */
function createDeleteRow(initialData) {
    return new IdentifiableRowComponent({
        elemIdOrJQuery: dogsTable,
        bodyRowTmplId: `${dogsTable}DeletableRowTmpl`,
        initialState: initialData ? new EntityRow(initialData, {append: true}) : undefined
    });
}

$(() => {
    const simpleListComponent = new SimpleListComponent({
        elemIdOrJQuery: dogsTable,
        bodyRowTmplId: "readOnlyRowTmpl",
        items: DbMocks.dogsOf(3),
    });
    const simpleListTableAdapter = simpleListComponent.tableBasedView.tableAdapter;
    simpleListComponent.init().then(stateChanges => {
        const items = stateChanges[0].newStateOrPart;
        const item0 = items[0];
        const item2 = items[2];
        const row0 = createEditRow(item0); // the current state is set to item0
        const row2 = createEditRow(item2); // the current state is set to items[2]
        return row0.init().then(() => {
            // here editableRow.view.$elem is not initialized
            const extractedEntity = row0.extractEntity();
            AssertionUtils.isNull(extractedEntity, "extractedEntity != null");
        }).then(() => {
            // besides updating the row representation this also initializes editableRow.view.$elem
            return row0.update(new EntityRow({id: item0.id, name: `${item0.name}-updated (position retained)`}));
        }).then(() => {
            const extractedEntity = row0.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"0\",\"name\":\"dog 0-updated (position retained)\"}");
        }).then(() => {
            // creating a new row
            const transientRow = createEditRow();
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
            const row777 = createEditRow();
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
            return row2
                .update(new EntityRow({id: 888, name: `${item2.name} id (${item2.id}) changed to 888`}));
        }).then(() => {
            const extractedEntity = row2.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"888\",\"name\":\"dog 2 id (2) changed to 888\"}");
        }).then(() => {
            // creating a new row
            const row999 = createEditRow();
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
            const row555 = createDeleteRow();
            return row555.update(new EntityRow(
                {id: 555, name: `new deleted dog (id = 555, prepended)`},
                {append: false}
            )).then(() => row555);
        }).then((row555) => {
            const extractedEntity = row555.extractEntity();
            AssertionUtils.isTrue(JSON.stringify(extractedEntity) === "{\"id\":\"555\",\"name\":\"new deleted dog (id = 555, prepended)\"}");
            const firstRow = simpleListTableAdapter.$getAllRows().first();
            AssertionUtils.isTrue(firstRow[0] === row555.view.$elem[0]);
        });
    });

});
