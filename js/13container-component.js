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

    /*
        $(() => {
            const comp = new DrawingComponent("drawing-comp");
            const stateChange = new StateChange("UPDATE", comp.config);
            comp.state.collectStateChange(stateChange);
            return comp.init();
        });
    */

    // $(() => new DrawingComponent("drawing-comp"));

    $(() => JqueryWidgetsUtil.autoCreate());
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}