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
        SimpleListFactory.create({
            items: DbMock.DOGS,
            tableIdOrJQuery: "dogsTable"
        }).init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
