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
        const comp = new LayoutComponent("layout-comp");
        const initState = comp.state.currentState;

        const changeAfterInit = new Promise((resolve) => {
            setInterval(() => {
                const date = new Date().toLocaleTimeString();
                const newState = {
                    name: `${initState.name} ${date}`,
                    surname: `${initState.surname} ${date}`
                };
                comp.reset();
                comp.processStateChange(newState, true)
                    .then(() => comp.init()).then(it => resolve(it));
            }, 1000);
        });

        comp.init().then(() => changeAfterInit);
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}