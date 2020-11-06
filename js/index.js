// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
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
        new TabularEditor("persontable",
            "readOnlyRowTmpl", "editorRowTmpl").show();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
