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

    $(() => {
        /*
                const persons = [
                    new Person(1, "gigi1", "kent1",
                        [{id: 1, name: "cat1"}, {id: 2, name: "cat2"}, {id: 3, name: "cat3"}]),
                    new Person(2, "gigi2", "kent2",
                        [{id: 21, name: "cat21"}, {id: 22, name: "cat22"}, {id: 23, name: "cat23"}]),
                    new Person(4, "gigi4", "kent4",
                        [{id: 41, name: "cat41"}, {id: 22, name: "cat42"}, {id: 43, name: "cat43"}]),
                    new Person(3, "gigi3", "kent3",
                        [{id: 31, name: "cat31"}, {id: 32, name: "cat32"}, {id: 33, name: "cat33"}])
                ];
                const personsRepository = new InMemoryPersonsRepository(new EntityHelper(), persons);
        */
        const personsRepository = new PersonsRepository();

        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create({
            elemIdOrJQuery: "dyna-sel-one",
            repository: personsRepository,
            placeholder: "the name to search for",
            useLastSearchResult: true
        }).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const tableIdOrJQuery = "personsTable";
        const tableRelativePositionOnCreate = "prepend";

        const readOnlyRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, tableRelativePositionOnCreate
            });

        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmpl: "personsTableEditableRowTmpl",
                childCompFactories: new CatsChildCompFactory()
            });

        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmpl: "personsTableDeletableRowTmpl"
            });

        const component = EditableListFactory.prototype
            .create({tableIdOrJQuery, repository: personsRepository, readOnlyRow, editableRow, deletableRow});

        component.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
