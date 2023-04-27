// import { https } from 'follow-redirects';

// const apiKey = 'shrill-dew-9515';
// const echo3Dserver = 'https://api.echo3D.co/query?';
// const fileRequest = echo3Dserver + 'key=' + apiKey + '&file=';

// export default async function handler(req, res) {
//   const requestUrl = echo3Dserver + 'key=' + apiKey;
  
//   https.get(requestUrl, (responseJSON) => {
//     let json = '';
    
//     responseJSON.on('data', (d) => {
//       json += d;
//     });
    
//     responseJSON.on('end', () => {
//       const obj = JSON.parse(json);
      
//       // Add your logic here to process the fetched data
      
//       res.status(200).json(obj);
//     });
//   }).on('error', (error) => {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching GLB objects from echo3D.' });
//   });
// }