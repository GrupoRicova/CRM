import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {id } = req.query; // Get the account ID from the query parameters

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v16.0/${id}/ads`, // Use the account ID in the API endpoint URL
      {
        params: {
          fields: 'id,name,insights{reach,cpm,impressions,clicks,spend,frequency,ctr,actions},targeting,creative{name,object_story_spec,thumbnail_url}',
          access_token: process.env.PeToken, // Replace with your Facebook access token
        },
      }
    );

    res.status(200).json(data);
  } catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      
    });
  }
}
