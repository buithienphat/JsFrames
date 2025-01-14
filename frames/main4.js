async function main() {}

main();

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
