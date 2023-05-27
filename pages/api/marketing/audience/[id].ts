import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }; // Get the account ID from the query parameters

  try {
    const { data }: AxiosResponse = await axios.get(
      `https://graph.facebook.com/v16.0/${id}/customaudiences`, // Use the account ID in the API endpoint URL
      {
        params: {
          access_token: process.env.PeToken, // Replace with your Facebook access token
        },
      }
    );

    res.status(200).json(data);
  } catch (error: unknown) {
    console.error('API request failed:', (error as AxiosError).message);
    res.status(500).json({ error: 'API request failed' });
  }
}
