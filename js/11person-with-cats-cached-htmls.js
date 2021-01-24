if (Modernizr.template) {
    $.ajaxSetup({
        contentType: 'application/json',
        processData: false
    });
    $.ajaxPrefilter(function (options) {
        if (options.contentType === 'application/json' && options.data) {
            options.data = JSON.stringify(options.data);
        }
    });

    // html templates
    const urlPrefix = "scenarios/11person-with-cats-cached-htmls";
    const cachedUrls = new CachedUrls({
        name: "personsReadOnlyRow",
        url: `${urlPrefix}/persons-read-only-row.html`
    }, {
        name: "personsDeletableRow",
        url: `${urlPrefix}/persons-deletable-row.html`
    }, {
        name: "personsEditableRow",
        url: `${urlPrefix}/persons-editable-row.html`
    }, {
        name: "personsErrorRow",
        url: `${urlPrefix}/persons-error-row.html`
    }, {
        name: "catsEditableRow",
        url: `${urlPrefix}/cats-editable-row.html`
    });

    // main
    $(() => cachedUrls.namedUrls.then((namedUrls) => {
        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create("dyna-sel-one", DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {}).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const tableIdOrJQuery = "personsTable";

        // READ-ONLY ROW
        const readOnlyRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery,
            rowTmplHtml: namedUrls["personsReadOnlyRow"]
        });

        // friend (Person) dyna select one child component
        const friendDynaSelOneCompFactory = DynamicSelectOneFactory.createChildComponentFactory(
            "friend", Person.parse, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY);

        // EDITABLE ROW
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmplHtml: namedUrls["personsEditableRow"],
                errorRowTmplHtml: namedUrls["personsErrorRow"],
                childCompFactories: [friendDynaSelOneCompFactory,
                    new CatsCreateDeleteListChildFactory(namedUrls["catsEditableRow"])]
            });

        // DELETABLE ROW
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, rowTmplHtml: namedUrls["personsDeletableRow"]
            });

        // EDITABLE LIST
        const editableList = EditableListFactory.create({
            tableIdOrJQuery,
            repository: DbMock.PERSONS_REPOSITORY,
            readOnlyRow,
            editableRow,
            deletableRow
        });

        return editableList.init();
    }))
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
