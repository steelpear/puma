import React from 'react'
import Head from 'next/head'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@/styles/main.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ПУМА | Список сайтов</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
