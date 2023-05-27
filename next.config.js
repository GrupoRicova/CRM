const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FBPersonalToken: process.env.PeToken,
    FBPageToken: process.env.PaToken
  },
};

module.exports = {
  ...nextConfig,
 
};
