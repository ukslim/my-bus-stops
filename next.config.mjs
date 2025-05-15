import NextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const withPWA = NextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

export default withPWA({});
