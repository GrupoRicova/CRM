import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {search} = req.query
  try {
    const { data } = await axios.get(
      'https://graph.facebook.com/v16.0/search',
      {
        params: {
          type: 'adTargetingCategory',
          class: 'behaviors',
         
         
          access_token: process.env.PeToken, // Reemplaza con tu token de acceso de Facebook
        },
      }
    );

    const behaviors = data.data;
    console.log(search)
    
    const filter = behaviors.filter(
        (category:any) =>
          category.name.includes(search) 
      );
    res.status(200).json(behaviors);
  } catch (error) {
    console.error('La solicitud de la API falló:', error);
    res.status(500).json({ error: 'La solicitud de la API falló' });
  }
}
