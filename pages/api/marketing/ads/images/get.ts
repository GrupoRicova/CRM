import axios from 'axios';
import { NextApiHandler } from 'next';
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v16.0/act_<AD_ACCOUNT_ID>/adimages`,
      {
        params: {
          access_token: '<ACCESS_TOKEN>',
        },
      }
    );

    const images = response.data.data;
    return res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
}
export default  handler