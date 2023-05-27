import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;
  try {
    const { data } = await axios.get(
      'https://graph.facebook.com/v16.0/search',
      {
        params: {
          type: 'adinterest',
          q: search,
          access_token: process.env.PeToken, // Replace with your Facebook access token
        },
      }
    );

    const interests = data.data;

    res.status(200).json(interests);
  }catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      imageData: undefined,
    });
  }
}
