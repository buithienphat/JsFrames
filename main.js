const finSDK = (callBack) => {
  const createIframes = () => {
    // Create frames
    const iframeST = document.createElement("iframe");
    iframeST.src = "./frames/page1.html";
    iframeST.id = "iframeST";

    const iframeEX = document.createElement("iframe");
    iframeEX.src = "./frames/page2.html";
    iframeEX.id = "iframeEX";

    iframeST.onload = () => initFrameST(iframeST);
    iframeEX.onload = () => initFrameEX(iframeEX);

    const body = document.body;
    body.appendChild(iframeST);
    body.appendChild(iframeEX);
  };

  window.addEventListener("message", (event) => {
    const progressDisplay = document.getElementById("progressDisplay");
    if (event.data.type === "progress") {
      progressDisplay.textContent = " progress: " + event.data.progress + "%";
    }
  });

  //Check if the have all 2 frames
  //CallBack

  document.addEventListener("DOMContentLoaded", createIframes);
};

// Run finSDK
finSDK(
  (data, origin) => {
    console.log("Message from ifram e: ", data);
    console.log("Origin: ", origin);
  },
  (progress) => {
    console.log("progress", progress);
  }
);

const initFrameST = (iframeST) => {
  // listen ...
  iframeST.contentWindow.postMessage("data ST Frame", "*");
};

const initFrameEX = (iframeEX) => {
  // listen ...
  iframeEX.contentWindow.postMessage("data EX Frame", "*");
};
