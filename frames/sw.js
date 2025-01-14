async function fetchGzipFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Không thể fetch tệp: ${response.statusText}`);
  }
  return response.body;
}

async function ungzip(data) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = data.pipeThrough(ds);
  const reader = decompressedStream.getReader();

  let files = [];
  let done, value;
  while (({ done, value } = await reader.read()) && !done) {
    files.push(value);
  }
  const blob = new Blob(files);
  const arrayBuffer = await blob.arrayBuffer();

  //New
  const dataView = new DataView(arrayBuffer);
  let offset = 0;
  while (offset < dataView.byteLength) {
    const fileName = getString(dataView, offset, 100).trim();
    if (!fileName) {
      break;
    }
    const fileSize = parseInt(getString(dataView, offset + 124, 12).trim(), 8);
    offset += 512;
    const fileContent = new Uint8Array(arrayBuffer, offset, fileSize);

    const nameStorage = fileName.substring(
      fileName.lastIndexOf("/") + 1,
      fileName.indexOf(" ")
    );
    if (nameStorage !== "") {
      writeToFileSystem(nameStorage, fileContent);
    }

    offset += fileSize;
    offset = Math.ceil(offset / 512) * 512;
  }

  // End new
  return new Uint8Array(arrayBuffer);
}

function getString(dataView, offset, length) {
  const bytes = new Uint8Array(dataView.buffer, offset, length);
  return new TextDecoder().decode(bytes);
}

async function writeToFileSystem(fileName, data) {
  const rootHandle = await navigator.storage.getDirectory();
  const fileHandle = await rootHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

async function listFilesInOPFS() {
  const rootHandle = await navigator.storage.getDirectory();

  // Get File + Name
  for await (const [name, handle] of rootHandle) {
    const file = await handle.getFile();
    const content = await file.text();
    console.log("name: ", name + " - content: ", content);
  }
}

// // Xoá
async function deleteStorage() {
  // Hàm để xóa các tệp và thư mục
  async function deleteFiles(directoryHandle) {
    for await (const entry of directoryHandle.values()) {
      await directoryHandle.removeEntry(entry.name, { recursive: true });
      console.log(`Đã xóa: ${entry.kind} - ${entry.name}`);
      document.write(`Đã xóa: ${entry.kind} - ${entry.name}<br>`);
    }
  }
  try {
    // Lấy thư mục gốc
    const root = await navigator.storage.getDirectory();

    // Xóa các tệp và thư mục trong thư mục gốc
    document.write("Deleting files and directories:<br>");
    await deleteFiles(root);
  } catch (error) {
    console.error("Error accessing storage:", error);
  }
}

// worker.js;
self.addEventListener("message", async (event) => {
  const url = event.data;

  try {
    // Bước 1: Fetch tệp gzip
    const compressedData = await fetchGzipFile(url);

    // Bước 2: Giải nén 1 file gzip
    const uncompressedData = await ungzip(compressedData);

    // Bước 3: Ghi tệp đã giải nén vào OPFS
    // await writeToFileSystem(name, uncompressedData);

    //postMessage to worker
    const root = await navigator.storage.getDirectory();
    for await (const [name, handle] of root) {
      const file = await handle.getFile();
      const content = await file.text();
      self.postMessage({ name, content });
    }
  } catch (error) {
    self.postMessage({ error: error.message });
  }
});
