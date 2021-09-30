import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {createComponent} from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";

$(() => {
    // the puppeteer
    const component = createComponent($("#parent-component"),
        withDebugger({debuggerElemIdOrJQuery: "main-debugger"})).render();

    // the application using the html-puppeteer
    new Scenario13App(component, {innerPart: "dogs"}).run();
});