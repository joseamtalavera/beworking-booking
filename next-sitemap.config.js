/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://be-working.com',
  generateRobotsTxt: true,
  outDir: './public',
  exclude: [
    '/rooms/*',
    '/register',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
