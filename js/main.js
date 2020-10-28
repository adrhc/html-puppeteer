// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
    const table = new Table("producttable", "productrow", "editor");
    DATA.forEach(it => table.addRow(...Object.values(it)))
    Array(10).fill().map((_, i) => i)
        .forEach((i) => table.addRow(i, `Stuff ${i}`));
    table.insertRow(5);
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
