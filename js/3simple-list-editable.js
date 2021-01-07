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
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
