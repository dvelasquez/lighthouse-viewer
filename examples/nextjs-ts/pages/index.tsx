import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import React2LighthouseViewer, { Result } from 'react2-lighthouse-viewer';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<Result | null>(null);
  useEffect(() => {
    fetch('/report.json')
      .then((res) => res.json())
      .then((data: Result) => setData(data));
  }, []);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
        </div>

        <div className={styles.grid}></div>
        <section>{data && data.userAgent ? <React2LighthouseViewer json={data} /> : 'Loading'}</section>
      </main>
    </>
  );
}
