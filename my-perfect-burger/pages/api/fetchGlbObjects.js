// fetchGlbObjects.js
import axios from 'axios';

const apiKey = 'shrill-dew-9515';
const echo3Dserver = 'https://api.echo3D.co/query?';
const fileRequest = entryID => echo3Dserver + 'key=' + apiKey + '&file=' + entryID;

export default async function handler(req, res) {
  const { entryID } = req.query;
  const requestUrl = fileRequest(entryID);

  try {
    const response = await axios.get(requestUrl);
    const obj = response.data;

    // Add your logic here to process the fetched data

    res.status(200).json(obj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the GLB object from echo3D.' });
  }
}
