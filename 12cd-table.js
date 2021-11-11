import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario10EventsBinder from "./ro/go/adrhc/app/components/event-binders/Scenario10EventsBinder.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    const eventsBinders = [new StateChangeEventsBinder("MAIN-debugger"),
        component => new Scenario10EventsBinder(/** @type {AbstractContainerComponent} */ component, {haveDogs: true})];
    const options = addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(...eventsBinders).options();
    animate(options);
});
