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

    function generateNewState() {
        const date = new Date().toLocaleTimeString();
        return {
            name: `Kent ${date}`,
            surname: `Gigi ${date}`
        };
    }

    $(() => {
        const comp = new LayoutComponent("layout-comp");

        comp.init().then(() => setInterval(() =>
            comp.processStateChange(generateNewState(), true)
                .then(() => comp.init()), 1000));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}