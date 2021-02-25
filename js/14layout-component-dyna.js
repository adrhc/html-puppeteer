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

        const changeAfterInit = new Promise((resolve) => {
            setTimeout(() => {
                const date = new Date().toLocaleTimeString();
                const previousState = comp.state.currentState;
                const newState = {
                    name: `${previousState.name} ${date}`,
                    surname: `${previousState.surname} ${date}`
                };
                comp.reset();
                comp.processStateChange(newState, true);
                comp.init().then(it => resolve(it));
            }, 2000);
        });

        return comp.init().then(() => changeAfterInit);
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}