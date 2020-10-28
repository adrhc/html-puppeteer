// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
    const table = new Table("producttable", "productrow");
    table.addRow("1235646565", "Stuff");
    table.addRow("0384928528", "Acme Kidney Beans 2");
    Array(10).fill().map((_, i) => i)
        .forEach((i) => table.addRow(i, `Stuff ${i}`));
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
