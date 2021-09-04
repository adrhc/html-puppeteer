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
        /**
         * JQWUtil.createComponents() creates a Promise because data-dont-auto-initialize="true" is missing
         *
         * JQWUtil.createComponents() will process a StateChange (see its _initializeState), such that
         * updateViewOnce (see ContainerComponent) will be set (to true), so that's why resetThenUpdate() is used.
         */
        JQWUtil.createComponents()
            .then(comp => comp.resetThenUpdate({
                seconds: comp.state.currentState.seconds,
                name: "Gigi",
                surname: "Kent"
            }).then(() => comp))
            .then((comp) => {
                /**
                 * @type {DrawingComponent}
                 */
                const drawComp = comp;
                const seconds = drawComp.state.currentState.seconds;
                const resetThenUpdate = () => drawComp.resetThenUpdate(generateNewState(seconds));
                setInterval(resetThenUpdate, seconds * 1000);
            });
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}