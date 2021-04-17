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
        const DYNA_SEL_ONE_PERS_REPOSITORY = new DbDynaSelOneRepository("person", Person.parse);

        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create("dyna-sel-one", DYNA_SEL_ONE_PERS_REPOSITORY).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const elemIdOrJQuery = "personsTable";

        // READ-ONLY ROW
        const readOnlyRow = SimpleRowFactory.createIdentifiableRow({
            elemIdOrJQuery,
            rowTmplHtml: namedUrls["personsReadOnlyRow"]
        });

        // friend (Person) dyna select one child component
        const friendDynaSelOneCompFactory = DynamicSelectOneFactory.createDynaSelOneRowChildCompFactory(
            "friend", Person.parse, DYNA_SEL_ONE_PERS_REPOSITORY);

        // EDITABLE ROW
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                elemIdOrJQuery,
                rowTmplHtml: namedUrls["personsEditableRow"],
                errorRowTmplHtml: namedUrls["personsErrorRow"],
                childCompFactories: [friendDynaSelOneCompFactory,
                    new CatsCreateDeleteListChildFactory(DYNA_SEL_ONE_PERS_REPOSITORY, {
                        bodyRowTmplHtml: namedUrls["catsEditableRow"]
                    })]
            });

        // DELETABLE ROW
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                elemIdOrJQuery, rowTmplHtml: namedUrls["personsDeletableRow"]
            });

        // EDITABLE LIST
        const editableList = EditableListFactory.create({
            elemIdOrJQuery,
            repository: new DbCrudRepository("persons", Person.parse),
            readOnlyRow,
            editableRow,
            deletableRow,
            // default: () => IdentifiableEntity(TRANSIENT_ID)
            // newEntityFactoryFn: () => new Person(IdentifiableEntity.TRANSIENT_ID),
            extractedEntityConverterFn: Person.parse
        });

        return editableList.init();
    }))
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
