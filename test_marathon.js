const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('kaliplartablosu.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });

// Load scripts 
const js = fs.readFileSync('kaliplartablosu.js', 'utf8');
const scriptEl = dom.window.document.createElement("script");
scriptEl.textContent = js;
dom.window.document.body.appendChild(scriptEl);

// Mock functions
dom.window.ColorEngine = { colorize: (w) => w };
dom.window.VerbGenerator = {
    generateVerbList: () => ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12", "v13", "v14"]
};

// Run openMarathon
dom.window.currentRoot = "ك ت ب";
dom.window.openMarathon();

// Select a verb
// In lobby, just call prepareMarathonPlay manually
dom.window.prepareMarathonPlay();

// Change to stage 2
dom.window.changeMarathonStage(1);
dom.window.changeMarathonStage(1);

// Finish
dom.window.changeMarathonStage(1);

console.log("screen-result active?:", dom.window.document.getElementById('screen-result').classList.contains('active'));
console.log("screen-play active?:", dom.window.document.getElementById('screen-play').classList.contains('active'));
console.log("error-list HTML:", dom.window.document.getElementById('error-list').innerHTML);

