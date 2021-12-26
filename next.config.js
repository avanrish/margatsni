/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');
const withBundleAnalyzer = require('@next/bundle-analyzer');

module.exports = () => {
  const plugins = [withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }), nextTranslate];
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    images: {
      domains: ['firebasestorage.googleapis.com'],
    },
    env: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    },
  });
};
