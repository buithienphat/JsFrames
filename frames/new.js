// document.querySelector("button").addEventListener("click", () => {
//   init();
// });

// async function init() {
//   const url = "http://127.0.0.1:5500/file.tar.gz";
//   const data = await fetchGzipFile(url);
//   decompressData(data);
// }

// async function decompressData(data) {
//   try {
//     const decompressionStream = new DecompressionStream("gzip");
//     const decompressedStream = data.pipeThrough(decompressionStream);
//     // Đọc dữ liệu từ stream đã giải nén
//     const reader = decompressedStream.getReader();
//     let files = []; // Giả sử tệp gzip chứa nhiều tệp
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
//       if (!fileName) {
//         break;
//       }
//       const fileSize = parseInt(
//         getString(dataView, offset + 124, 12).trim(),
//         8
//       );
//       offset += 512;
//       const fileContent = new Uint8Array(arrayBuffer, offset, fileSize);
//       saveToLocalStorage(fileName, fileContent);
//       offset += fileSize;
//       offset = Math.ceil(offset / 512) * 512;
//     }
//   } catch (err) {
//     console.log("err", err);
//   }
// }

// async function fetchGzipFile(url) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.body;
//   } catch (err) {
//     console.log("error", err);
//   }
// }

// function getString(dataView, offset, length) {
//   const bytes = new Uint8Array(dataView.buffer, offset, length);
//   return new TextDecoder().decode(bytes);
// }

// function saveToLocalStorage(fileName, fileContent) {
//   console.log("fileName", fileName);

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
//     displayFile(fileName, event.target.result);
//   };

//   reader.readAsText(fileBlob);
// }
