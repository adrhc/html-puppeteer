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
        const dogs = [{id: 1, name: "dog1"}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];
        SimpleListFactory.create({
            items: dogs,
            tableIdOrJQuery: "dogsTable"
        }).init();

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
                const personsRepository = new InMemoryPersonsRepository(persons);
                // const personsRepository = new PersonsRepository();

                TableEditorFactory.prototype.create({
                    tableIdOrJQuery: "personsTable", bodyRowTmplId: "personsRoRowTmpl", repository: personsRepository,
                    rowEditorComponentFactory: PersonRowEditorOldFactory.prototype.create
                }).init();

                DynamicSelectOneFactory.prototype.create({
                    elemId: "dyna-sel-one",
                    placeholder: "the name to search for", repository: personsRepository
                }).init();
        */
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
