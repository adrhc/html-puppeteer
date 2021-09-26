import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario10App from "./ro/go/adrhc/app/Scenario10App.js";

$(() => {
    // the puppeteer
    const component = animate(withDebugger({debuggerElemIdOrJQuery: "parent-state-and-debugger"}));

    // the application using the html-puppeteer
    new Scenario10App(component).run();
});