import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    const eventsBinders = [new StateChangeEventsBinder("MAIN-debugger"),
        component => new Scenario13App(/** @type {AbstractContainerComponent} */ component, "dogs")
    ];
    const options = addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(...eventsBinders).options();
    animate(options);
});