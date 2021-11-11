import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario10App from "./ro/go/adrhc/app/Scenario10App.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    // the puppeteer
    const component = animate(addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(new StateChangeEventsBinder("MAIN-debugger")).options());

    // the application using the html-puppeteer
    new Scenario10App(component).run();
});