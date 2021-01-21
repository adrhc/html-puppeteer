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
        const tableRelativePositionOnCreate = "prepend";

        // READ-ONLY ROW
        const readOnlyRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery,
            rowTmplHtml: namedUrls["personsReadOnlyRow"],
            tableRelativePositionOnCreate
        });

        // DynamicSelectOneComponent child component factory (see ChildComponentFactory)
        const friendDynaSelOneCompFactory = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createChildComponent: (idRowCompParent) => {
                const $parentElem = idRowCompParent.view.$elem;
                AssertionUtils.isNotNull($parentElem, "friendDynaSelOneCompFactory.createChildComponent");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", $parentElem),
                    DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent,
                            "friend", () => new Person())
                    })
            }
        };

        // EDITABLE ROW (using child component from CatsEditableListChildFactory)
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmplHtml: namedUrls["personsEditableRow"],
                childCompFactories: [friendDynaSelOneCompFactory,
                    new CatsCreateDeleteListChildFactory(namedUrls["catsEditableRow"])]
            });

        // DELETABLE ROW
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
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

        editableList.init();
    }))
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
