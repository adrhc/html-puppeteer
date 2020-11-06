// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
    $(document).ready(() => {
        new PersonsStore().get().then((prods) => {
            console.log(prods);
            new TabularEditor(prods, "persontable",
                "readOnlyRowTmpl", "editorRowTmpl").render();
        });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
