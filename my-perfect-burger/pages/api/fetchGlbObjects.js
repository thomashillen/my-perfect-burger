// // fetchGlbObjects.js
// import axios from 'axios';

// const apiKey = 'shrill-dew-9515';
// const echo3Dserver = 'https://api.echo3D.co/query?';
// const fileRequest = entryID => echo3Dserver + 'key=' + apiKey + '&file=' + entryID;

// export default async function handler(req, res) {
//   const { entryID } = req.query;
//   const requestUrl = fileRequest(entryID);

//   try {
//     const response = await axios.get(requestUrl);
//     const obj = response.data;

//     // Add your logic here to process the fetched data

//     res.status(200).json(obj);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching the GLB object from echo3D.' });
//   }
// }

var entries = []
for (let entry of db) { // Iterage over all database entries
  // Parse entry
  var srcFile = "https://api.echo3D.com/query?key=" + apiKey + "&file=";
  var typeFile = entry['hologram'].filename.toLowerCase().split('.').pop();
  switch (entry['hologram'].type) {
    case 'VIDEO_HOLOGRAM':
    case 'IMAGE_HOLOGRAM':
      srcFile += entry['hologram'].storageID;
      break;
    case 'MODEL_HOLOGRAM':
      switch (typeFile) {
        case 'glb':
          srcFile += entry['hologram'].storageID;
          break;
        case 'gltf':
        case 'obj':
        case 'fbx':
          srcFile += entry['additionalData'].glbHologramStorageID;
          break;
      }
      break;
    }
    
    // Parse additional data
    var x = (entry['additionalData'].x) ? 
              parseFloat(entry['additionalData'].x) : 0;
    
    // Do something with the entry
    entries.push({
      src: srcFile,
      x: x
    });
  }