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
        // const comp = new DrawingComponent("drawing-comp");
        // JQWUtil.createComponents() does not create a Promise because of data-dont-auto-initialize="true" in 14...html
        const comp = JQWUtil.createComponents();
        comp.compositeBehaviour.addChildComponentFactory([(parentComp) => {
            const elemIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
            return SimpleListFactory.create({items: DbMocks.DOGS, elemIdOrJQuery});
        }, (parentComp) => {
            const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
            return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY);
        }]);

        const seconds = comp.state.currentState.seconds;

        return comp.init().then(() => setInterval(() =>
            // comp has children: comp must be re-init to work as expected (i.e. children to be init-ed too)
            comp.resetThenUpdate(generateNewState(seconds), {dontRecordStateEvents: true})
                .then(() => comp.init()), seconds * 1000));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}