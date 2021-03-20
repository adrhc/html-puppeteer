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

    // DrawingComponent demo
    $(() => {
        JQueryWidgetsUtil.autoCreate()
            .then(comp => comp.processStateChanges({
                seconds: comp.state.currentState.seconds,
                name: "Gigi",
                surname: "Kent"
            }, {}).then(() => comp))
            .then((comp) => {
                /**
                 * @type {DrawingComponent}
                 */
                const drawComp = comp;
                const seconds = drawComp.state.currentState.seconds;
                const procStateChgFn = () => drawComp.resetThenUpdate(generateNewState(seconds));
                setInterval(procStateChgFn, seconds * 1000);
            });
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}