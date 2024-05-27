// document.querySelector("button").addEventListener("click", () => {
//   main();
// });

// // Function to fetch API and update progress
// async function fetchAPIAndUpdateProgress(url, updateProgress) {
//   const contentLength = await preLoadModel(url);

//   const response = await fetch(url);
//   const reader = response.body.getReader();

//   let receivedLength = 0;
//   let chunks = [];
//   while (true) {
//     const { done, value } = await reader.read();

//     if (done) {
//       break;
//     }
//     chunks.push(value);
//     receivedLength += value.length;
//     let progress = (receivedLength / contentLength) * 90;

//     updateProgress(progress);
//   }

//   let chunksAll = new Uint8Array(receivedLength);
//   let position = 0;
//   for (let chunk of chunks) {
//     chunksAll.set(chunk, position);
//     position += chunk.length;
//   }
//   let result = new TextDecoder().decode(chunksAll);

//   return result;
// }

// function executeScriptAndUpdateProgress(scriptContent, updateProgress) {
//   return new Promise((resolve, reject) => {
//     try {
//       eval(scriptContent);
//       let progress = 100;
//       updateProgress(progress);
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// function updateProgress(percentage) {
//   parent.postMessage(
//     { type: "progress", progress: +percentage.toFixed(0) },
//     "*"
//   );
// }

// async function main() {
//   // try {
//   //   const apiUrl = "https://json.m.pro/script/bls.js";
//   //   const data = await fetchAPIAndUpdateProgress(apiUrl, updateProgress);
//   //   await executeScriptAndUpdateProgress(data, updateProgress);
//   // } catch (error) {
//   //   console.log("error", error);
//   //   throw error;
//   // }
//   // try {
//   //   const res = await fetch("https://json.m.pro/script/bls.js");
//   //   const reader = res.body.getReader();
//   //   if (!res.ok) return;
//   //   let chunks = [];
//   //   while (true) {
//   //     const { done, value } = await reader.read();
//   //     if (done) {
//   //       break;
//   //     }
//   //     chunks.push(value);
//   //   }
//   //   const blob = new Blob(chunks);
//   //   const arrayBuffer = await blob.arrayBuffer();
//   //   const result = new TextDecoder().decode(arrayBuffer);
//   // } catch (error) {
//   //   console.log("error", error);
//   // }
//   // try {
//   //   const res = await fetch("http://127.0.0.1:5500/background.jpg.gz");
//   //   if (!res.ok) {
//   //     console.log("Network response was not ok");
//   //     return;
//   //   }
//   //   const compressedStream = res.body.pipeThrough(
//   //     new DecompressionStream("gzip")
//   //   );
//   //   const response = new Response(compressedStream);
//   //   const blob = await response.blob();
//   //   const imgURL = URL.createObjectURL(blob);
//   //   displayImage(imgURL, "background.jpg");
//   // } catch (error) {
//   //   console.log("error", error);
//   // }
//   try {
//     const response = await fetch("http://127.0.0.1:5500/file.tar.gz");
//     const readableStream = response.body;
//     // Bước 2: Giải nén tệp
//     const decompressionStream = new DecompressionStream("gzip");
//     const decompressedStream = readableStream.pipeThrough(decompressionStream);
//     // Đọc dữ liệu từ stream đã giải nén
//     const reader = decompressedStream.getReader();
//     let files = [];
//     let done, value;
//     while (({ done, value } = await reader.read()) && !done) {
//       files.push(value);
//     }
//     const blob = new Blob(files);
//     const arrayBuffer = await blob.arrayBuffer();
//     const dataView = new DataView(arrayBuffer);
//     let offset = 0;
//     while (offset < dataView.byteLength) {
//       const fileName = getString(dataView, offset, 100).trim();
//       if (!fileName || fileName.includes("Mac")) {
//         offset += 512;
//         continue;
//       }
//       const fileSize = parseInt(
//         getString(dataView, offset + 124, 12).trim(),
//         8
//       );
//       offset += 512;
//       const fileContent = new Uint8Array(arrayBuffer, offset, fileSize);
//       const fileBlob = new Blob([fileContent], { type: getMimeType(fileName) });
//       const reader = new FileReader();
//       reader.onload = function (event) {
//         // saveStorageSystem(fileName, event.target.result);
//       };

//       reader.readAsText(fileBlob);

//       offset += fileSize;
//       offset = Math.ceil(offset / 512) * 512;
//     }
//   } catch (error) {
//     console.log("error", error);
//   }

//   saveStorageSystem();
//   seeStorage();
//   // deleteStorage();
//   //
//   // ----> saveStorageSystem(); <-----
//   // const quota = await navigator.storage.estimate();
//   // const totalSpace = Math.floor(quota.quota / (1000 * 1000));
//   // const usedSpace = quota.usage;
//   // const str = `totalSpace: ${totalSpace}, ${usedSpace}`;
//   // document.write(str);
//   // const message = "<div>test</div>";
//   // const root = await navigator.storage.getDirectory();
//   // const fileHandle = await root.getFileHandle("test.html", { create: true });
//   // const writable = await fileHandle.createWritable();
//   // console.log("writable", writable);
//   // await writable.write(new TextEncoder().encode(message));
//   // await writable.close();
//   // const draftHandle = await fileHandle.getFile();
//   // const content = await draftHandle.text();
//   // document.write(content);
// }

// const saveOrOpenBlob = (url) =>
//   new Promise((resolve) => {
//     var blob;
//     var xmlHTTP = new XMLHttpRequest();
//     xmlHTTP.open("GET", url, true);
//     xmlHTTP.responseType = "arraybuffer";

//     xmlHTTP.onerror = function (e) {
//       console.log("onerror", url, e);
//     };
//     xmlHTTP.onload = function (e) {
//       blob = new Blob([xmlHTTP.response]);
//     };
//     xmlHTTP.onprogress = function (pr) {
//       // console.log("saveOrOpenBlob---", url, pr.loaded, pr.total);
//     };
//     xmlHTTP.onloadend = function (e) {
//       const resURL = window.URL.createObjectURL(blob);
//       console.log("onloadend", url, resURL);
//       resolve(e.loaded);
//       window.URL.revokeObjectURL(resURL);
//     };
//     xmlHTTP.send();
//   });

// const preLoadModel = async function (modelURL) {
//   try {
//     const resURL = await saveOrOpenBlob(modelURL);
//     console.log("preLoadModel-onload", modelURL, resURL);
//     return resURL;
//   } catch (e) {
//     console.log("--preLoadModel--err", e);
//     throw e;
//   }
// };

// function getString(dataView, offset, length) {
//   const bytes = new Uint8Array(dataView.buffer, offset, length);
//   return new TextDecoder().decode(bytes);
// }

// function saveToLocalStorage(fileName, fileContent) {
//   if (
//     fileName.includes(".DS_Store") ||
//     fileName.includes("._") ||
//     fileName.includes("PaxHeader")
//   )
//     return;
//   const fileBlob = new Blob([fileContent], { type: getMimeType(fileName) });

//   const reader = new FileReader();
//   reader.onload = function (event) {
//     localStorage.setItem(fileName, event.target.result);
//     localStorage.getItem(`${fileName}`);
//   };

//   reader.readAsText(fileBlob);
// }

// function getMimeType(fileName) {
//   if (fileName.endsWith(".html")) return "text/html";
//   if (fileName.endsWith(".css")) return "text/css";
//   return "application/octet-stream";
// }

// async function saveStorageSystem(fileName, value) {
//   const quota = await navigator.storage.estimate();
//   const totalSpace = Math.floor(quota.quota / (1000 * 1000));
//   const usedSpace = quota.usage;

//   const str = `totalSpace: ${totalSpace}, ${usedSpace}`;
//   document.write(str);

//   const message = "<h1>this is Header</h1>";

//   const root = await navigator.storage.getDirectory();
//   const fileHandle = await root.getFileHandle("index3.html", {
//     create: true,
//   });
//   console.log("fileHandle", fileHandle);

//   const writable = await fileHandle.createWritable();
//   await writable.close();
// }

// async function seeStorage() {
//   // Hàm để hiển thị thông tin các tệp và thư mục
//   async function listFiles(directoryHandle) {
//     console.log("directoryHandle", directoryHandle);
//     for await (const entry of directoryHandle.values()) {
//       if (entry.kind === "file") {
//         console.log(`File: ${entry.name}`);
//         document.write(`File: ${entry.name}<br>`);
//       } else if (entry.kind === "directory") {
//         console.log(`Directory: ${entry.name}`);
//         document.write(`Directory: ${entry.name}<br>`);
//       }
//     }
//   }
//   try {
//     // Lấy thư mục gốc
//     const root = await navigator.storage.getDirectory();
//     // Liệt kê các tệp và thư mục trong thư mục gốc
//     document.write("Listing files and directories:<br>");
//     await listFiles(root);
//   } catch (error) {
//     console.error("Error accessing storage:", error);
//   }
// }

// async function deleteStorage() {
//   // Hàm để xóa các tệp và thư mục
//   async function deleteFiles(directoryHandle) {
//     for await (const entry of directoryHandle.values()) {
//       await directoryHandle.removeEntry(entry.name, { recursive: true });
//       console.log(`Đã xóa: ${entry.kind} - ${entry.name}`);
//       document.write(`Đã xóa: ${entry.kind} - ${entry.name}<br>`);
//     }
//   }
//   try {
//     // Lấy thư mục gốc
//     const root = await navigator.storage.getDirectory();

//     // Xóa các tệp và thư mục trong thư mục gốc
//     document.write("Deleting files and directories:<br>");
//     await deleteFiles(root);
//   } catch (error) {
//     console.error("Error accessing storage:", error);
//   }
// }
