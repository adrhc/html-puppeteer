if (Modernizr.template) {
    $.ajaxSetup({
        contentType: 'application/json',
        processData: false
    });
    $.ajaxPrefilter(function (options) {
        if (options.data) {
            options.data = JSON.stringify(options.data);
        }
    });
    $(() => {
        new TabularComponent("personsTable", "tableBodyTmpl",
            "readOnlyRowTmpl", "editableRowTmpl", "editorForm")
            .show();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
