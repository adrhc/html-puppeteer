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

    function generateNewState(seconds) {
        const date = new Date().toLocaleTimeString();
        return {
            seconds,
            name: `Kent ${date}`,
            surname: `Gigi ${date}`
        };
    }

    $(() => {
        const comp = new LayoutComponent("layout-comp");

        const seconds = comp.state.currentState.seconds;

        comp.init()
            .then(() => setInterval(() =>
                // comp has no children: comp.processStateChange works as expected even without re-init
                comp.processStateChange(generateNewState(seconds)), seconds * 1000));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}