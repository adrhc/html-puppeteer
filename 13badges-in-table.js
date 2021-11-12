import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import CatsWithKittensEventsBinder from "./ro/go/adrhc/app/components/event-binders/CatsWithKittensEventsBinder.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    const eventsBinders = [new StateChangeEventsBinder("MAIN-debugger"),
        component => new CatsWithKittensEventsBinder(component)];
    const options = addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(...eventsBinders).options();
    animate(options);
});