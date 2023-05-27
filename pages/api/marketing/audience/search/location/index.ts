import axios from 'axios';

export default async function handler(req: { query: { search: any; type: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  const { search,type } = req.query;
  try {
    const { data } = await axios.get(
      'https://graph.facebook.com/v16.0/search',
      {
        params: {
          type: 'adgeolocation',
          q: search, // Replace with the region or location you want to search for
          access_token: process.env.PeToken,
          location_types:[type] // Replace with your Facebook access token
        },
      }
    );
    const locations = data.data;

    res.status(200).json(locations);
  } catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      
    });
  }
}
