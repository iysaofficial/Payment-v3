// _app.js
import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>
      <Script 
        src="https://kit.fontawesome.com/62d9734c39.js" 
        crossorigin="anonymous"
        strategy="lazyOnload" // Menggunakan strategi "lazyOnload"
      />
      <Component {...pageProps} />
    </>
  );
}
