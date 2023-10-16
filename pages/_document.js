import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
    <Head>
    <link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/pwa3.png"></link>
<meta name="theme-color" content="#000" />

      <title>Menu Master</title>
  
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
