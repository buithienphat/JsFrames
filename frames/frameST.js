document.getElementById("startDownloadButton").addEventListener("click", () => {
  main();
});

// Function to fetch API and update progress
async function fetchAPIAndUpdateProgress(url, updateProgress) {
  const contentLength = await preLoadModel(url);
  const response = await fetch(url);
  const reader = response.body.getReader();

  let receivedLength = 0;
  let chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    let progress = (receivedLength / contentLength) * 90;

    document.querySelector("#progress").textContent =
      " progress dowload: " + progress.toFixed(0) + "%";

    updateProgress(progress);
  }

  let chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  let result = new TextDecoder("utf-8").decode(chunksAll);

  const blob = new Blob(chunks);
  const urlBlob = URL.createObjectURL(blob);

  console.log("urlBlob", urlBlob);

  //demo Zip local

  return result;
}

function executeScriptAndUpdateProgress(scriptContent, updateProgress) {
  return new Promise((resolve, reject) => {
    try {
      eval(scriptContent);
      let progress = 100;
      updateProgress(progress);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function updateProgress(percentage) {
  parent.postMessage(
    { type: "progress", progress: +percentage.toFixed(0) },
    "*"
  );
}

async function main() {
  try {
    const apiUrl = "https://json.m.pro/script/bls.js";
    const data = await fetchAPIAndUpdateProgress(apiUrl, updateProgress);
    await executeScriptAndUpdateProgress(data, updateProgress);
  } catch (error) {
    throw error;
  }
}

const saveOrOpenBlob = (url) =>
  new Promise((resolve) => {
    var blob;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open("GET", url, true);
    xmlHTTP.responseType = "arraybuffer";

    xmlHTTP.onerror = function (e) {
      console.log("onerror", url, e);
    };
    xmlHTTP.onload = function (e) {
      blob = new Blob([xmlHTTP.response]);
    };
    xmlHTTP.onprogress = function (pr) {
      // console.log("saveOrOpenBlob---", url, pr.loaded, pr.total);
    };
    xmlHTTP.onloadend = function (e) {
      const resURL = window.URL.createObjectURL(blob);
      console.log("onloadend", url, resURL);
      resolve(e.loaded);
      window.URL.revokeObjectURL(resURL);
    };
    xmlHTTP.send();
  });

const preLoadModel = async function (modelURL) {
  try {
    const resURL = await saveOrOpenBlob(modelURL);
    console.log("preLoadModel-onload", modelURL, resURL);
    return resURL;
  } catch (e) {
    console.log("--preLoadModel--err", e);
    throw e;
  }
};
