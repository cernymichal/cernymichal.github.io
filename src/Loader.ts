import * as Utils from "Utils";

const request = new XMLHttpRequest();

// update app-loading-bar
const loadingBar = document.getElementById("app-loading-bar");

request.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
        Utils.updateLoading(loadingBar, e.loaded / e.total);
    }
});

// on load create a script tag with cached main.js
request.addEventListener("load", () => {
    const scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "main.js");
    document.body.appendChild(scriptElement);
});

// dispatch request
request.open("GET", "main.js", true);
request.send();
