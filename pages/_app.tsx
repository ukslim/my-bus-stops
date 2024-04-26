import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

// biome-ignore lint/style/useNamingConvention: NextJS convention
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
