import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

$(() => {
    // the puppeteer
    const component = animate(addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(new StateChangeEventsBinder("MAIN-debugger")).options());

    // the application using the html-puppeteer
    new Scenario13App(component, {innerPart: "dogs"}).run();
});