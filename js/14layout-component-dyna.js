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
            seconds: seconds,
            name: `Kent ${date}`,
            surname: `Gigi ${date}`
        };
    }

    $(() => {
        const items = [{id: 1, name: "dog1"}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];

        const comp = new LayoutComponent("layout-comp");
        comp.compositeBehaviour.addChildComponentFactory({
            createChildComponent(parentComp) {
                const tableIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
                return SimpleListFactory.create({items, tableIdOrJQuery});
            }
        });
        comp.compositeBehaviour.addChildComponentFactory({
            createChildComponent(parentComp) {
                const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
                return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {});
            }
        });

        const seconds = comp.state.currentState.seconds;

        return comp.init()
            .then(() => setInterval(() =>
                comp.processStateChange(generateNewState(seconds), true)
                    .then(() => comp.init()), seconds * 1000));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}