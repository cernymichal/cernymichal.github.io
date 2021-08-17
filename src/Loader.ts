import * as Utils from "Utils";

const request = new XMLHttpRequest();
const loadingBar = document.getElementById("app-loading-bar");

request.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
        Utils.updateLoading(loadingBar, e.loaded / e.total);
    }
});

request.addEventListener("load", () => {
    const scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", "main.js");
    document.body.appendChild(scriptElement);
});

request.open("GET", "main.js", true);
request.send();
