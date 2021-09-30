import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";

$(() => {
    // the puppeteer
    const component = animate(withDebugger({debuggerElemIdOrJQuery: "main-debugger"}));

    // the application using the html-puppeteer
    new Scenario13App(component).run();
});