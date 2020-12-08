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
        const personsRepository = new InMemoryPersonsRepository();

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
