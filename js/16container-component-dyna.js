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
        // const comp = new DrawingComponent("drawing-comp");
        const comp = JqueryWidgetsUtil.autoCreate();
        comp.compositeBehaviour.addChildComponentFactory([(parentComp) => {
            const tableIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
            return SimpleListFactory.create({items: DbMock.DOGS, tableIdOrJQuery});
        }, (parentComp) => {
            const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
            return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {});
        }]);
        comp.init().then(() => console.log("16container-component-dyna.js started"));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}