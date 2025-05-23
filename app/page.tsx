import Image from 'next/image';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <Image
          className='dark:invert'
          src='/android-chrome-512x512.png'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />

        <div>
          <h1>Nikan Group Test</h1>
          <p>A test project for Nikan Group by Abolfazl Chaman</p>
        </div>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
        footer placeholder
      </footer>
    </div>
  );
}
