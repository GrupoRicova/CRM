import axios from 'axios';
import { NextApiHandler } from 'next';
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = req.body;

  // Make a request to the Facebook Graph API to upload the image
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v14.0/act_<AD_ACCOUNT_ID>/adimages`,
      {
        filename: image.name,
        bytes: image.data,
      },
      {
        params: {
          access_token: '<ACCESS_TOKEN>',
        },
      }
    );

    const imageHash = response.data.hash;

    return res.status(200).json({ imageHash });
  } catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      
    });
  }
}
export default  handler