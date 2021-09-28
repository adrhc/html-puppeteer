import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import OpenCloseEventsBinder from "./ro/go/adrhc/html-puppeteer/core/component/events-binder/OpenCloseEventsBinder.js";
import ContainerEventsBinder from "./ro/go/adrhc/html-puppeteer/core/component/events-binder/ContainerEventsBinder.js";
import Scenario14App from "./ro/go/adrhc/app/Scenario14App.js";
import {generateString} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    // the puppeteer
    const component = animate(addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
        .withEventsBinders(new OpenCloseEventsBinder(), new ContainerEventsBinder())
        .to({
            itemProviderFn: () => ({id: Math.random(), name: generateString("name ")})
        }));

    // the application using the html-puppeteer
    new Scenario14App().run(component);
});