import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario10App from "./ro/go/adrhc/app/Scenario10App.js";
import OpenCloseEventsBinder from "./ro/go/adrhc/html-puppeteer/core/component/events-binder/OpenCloseEventsBinder.js";
import ContainerEventsBinder from "./ro/go/adrhc/html-puppeteer/core/component/events-binder/ContainerEventsBinder.js";

$(() => {
    // the puppeteer
    const component = animate(addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
        .withEventsBinders(new OpenCloseEventsBinder(), new ContainerEventsBinder())
        .options());

    // the application using the html-puppeteer
    new Scenario10App(component).run();
});