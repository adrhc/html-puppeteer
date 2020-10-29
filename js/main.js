// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
    const DATA = Array(8).fill()
        .map((_, i) => {
            return {nr: i + 1, code: Math.random(), name: `Stuff ${i}`};
        });
    window['view'] = new MainView(DATA);
    view.render();
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
