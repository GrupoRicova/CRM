import axios from 'axios';

export default async function handler(req: { body: { rules: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  try {
    const { rules } = req.body; // Assuming the rules are sent in the request body

    const { data } = await axios.post(
      `https://graph.facebook.com/v16.0/act_741292430975362/customaudiences`,
      {
        name: 'Audiencia Personalizada de Bienes Raíces',
        subtype: 'CUSTOM',
        description: 'Audiencia personalizada para segmentación de bienes raíces',
        rule:rules,
        customer_file_source: 'USER_PROVIDED_ONLY'
      },
      {
        params: {
          access_token: process.env.PaToken, // Replace with your Facebook access token
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
