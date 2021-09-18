import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/DebuggerOptionsBuilder.js";

$(() => {
    PUPPETEER.animate(withDebugger());
})