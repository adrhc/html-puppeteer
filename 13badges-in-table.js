import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario13EventsBinder from "./ro/go/adrhc/app/components/event-binders/Scenario13EventsBinder.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    const eventsBinders = [new StateChangeEventsBinder("MAIN-debugger"),
        component => new Scenario13EventsBinder(/** @type {AbstractContainerComponent} */ component, "dogs")
    ];
    const options = addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(...eventsBinders).options();
    animate(options);
});