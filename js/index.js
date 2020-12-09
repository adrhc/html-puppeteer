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
        const persons = {
            "1": new Person(1, "gigi1", "kent1",
                {"1": {id: 1, name: "cat1"}, "2": {id: 2, name: "cat2"}, "3": {id: 3, name: "cat3"}}),
            "2": new Person(2, "gigi2", "kent2",
                {"21": {id: 21, name: "cat21"}, "22": {id: 22, name: "cat22"}, "23": {id: 23, name: "cat23"}}),
            "3": new Person(3, "gigi3", "kent3",
                {"31": {id: 31, name: "cat31"}, "32": {id: 32, name: "cat32"}, "33": {id: 33, name: "cat33"}})
        };
        const personsRepository = new InMemoryPersonsRepository(persons);

        TableEditorFactory.prototype.create({
            tableId: "personsTable", repository: personsRepository,
            rowEditorComponentFactory: PersonRowEditorFactory.prototype.create
        }).init();

        DynamicSelectOneFactory.prototype.create({
            elemId: "dyna-sel-one",
            placeholder: "the name to search for", repository: personsRepository
        }).init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
