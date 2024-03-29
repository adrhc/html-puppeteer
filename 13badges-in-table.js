import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";

$(() => {
    // the puppeteer
    const component = animate(withDebugger({elemIdOrJQuery: "debugger-component"}));

    // the application using the html-puppeteer
    new Scenario13App(component, {innerPart: "dogs"}).run();
});