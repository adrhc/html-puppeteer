import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    PUPPETEER.animate(addDebugger().to());
})