import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import OpenCloseEventsBinder from "./ro/go/adrhc/app/components/event-binders/OpenCloseEventsBinder.js";
import {generateString} from "./ro/go/adrhc/app/Generators.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

$(() => {
    animate(addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
        .withEventsBinders(new StateChangeEventsBinder(), new OpenCloseEventsBinder())
        .to({
            childStateProviderFn: () => ({id: Math.random(), name: generateString("name ")})
        }));
});