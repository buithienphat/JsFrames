const worker = new Worker("sw.js");

const url = "http://127.0.0.1:5500/folder.tar.gz";

worker.postMessage(url);

worker.addEventListener("message", (event) => {
  console.log("event", event.data.name);
  if (event.data.name === "index.html") {
    document.body.innerHTML = event.data.content;
  }
  if (event.data.name === "style.css") {
    const style = document.createElement("style");
    style.innerHTML = event.data.content;
    document.head.appendChild(style);
  }
  if (event.data.name === "main.js") {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = event.data.content;
    document.head.appendChild(script);
    // eval ko run đc
    // eval(event.data.content);
  }

  if (event.data.name === "") {
  }
});
