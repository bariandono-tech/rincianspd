const fs = require('fs');
const path = require('path');
const { DecompressionStream } = require('stream/web'); // Node 18+

async function unpack() {
  const filePath = path.join(__dirname, 'public', 'index.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  // Regex to match script tags
  const manifestMatch = htmlContent.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
  const extResourcesMatch = htmlContent.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/);
  const templateMatch = htmlContent.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);

  if (!manifestMatch || !templateMatch) {
    console.error('Failed to find manifest or template in index.html');
    return;
  }

  const manifest = JSON.parse(manifestMatch[1].trim());
  let template = JSON.parse(templateMatch[1].trim());

  console.log(`Found manifest with ${Object.keys(manifest).length} assets.`);

  // Decode manifest assets
  const blobUrls = {};
  const extResources = extResourcesMatch ? JSON.parse(extResourcesMatch[1].trim()) : [];
  const resourceMap = {};

  for (const uuid of Object.keys(manifest)) {
    const entry = manifest[uuid];
    try {
      const binaryStr = Buffer.from(entry.data, 'base64');
      let finalBytes = binaryStr;

      if (entry.compressed) {
        // Gzip decompression
        const ds = new DecompressionStream('gzip');
        const writer = ds.writable.getWriter();
        writer.write(binaryStr);
        writer.close();
        
        const reader = ds.readable.getReader();
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
        finalBytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          finalBytes.set(chunk, offset);
          offset += chunk.length;
        }
      }

      // Convert finalBytes back to base64 or text depending on mime type
      let dataUrl;
      if (entry.mime.startsWith('image/')) {
        dataUrl = `data:${entry.mime};base64,${Buffer.from(finalBytes).toString('base64')}`;
      } else {
        dataUrl = `data:${entry.mime};utf8,` + encodeURIComponent(Buffer.from(finalBytes).toString('utf8'));
      }
      blobUrls[uuid] = dataUrl;
    } catch (err) {
      console.error(`Failed to decode asset ${uuid}:`, err);
    }
  }

  // Replace UUIDs in template with data URIs
  for (const uuid of Object.keys(manifest)) {
    if (blobUrls[uuid]) {
      template = template.split(uuid).join(blobUrls[uuid]);
    }
  }

  // Clean up template (SRI, crossorigin)
  template = template.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin="[^"]*"/gi, '');

  // Write unpacked HTML
  const unpackedPath = path.join(__dirname, 'public', 'unpacked.html');
  fs.writeFileSync(unpackedPath, template, 'utf8');
  console.log(`Successfully unpacked to: ${unpackedPath}`);
}

unpack().catch(console.error);
