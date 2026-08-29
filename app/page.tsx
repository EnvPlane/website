import Link from 'next/link';

export default function Home() {
  return (
    <main className="home-shell">
      <p className="eyebrow">envplane</p>
      <h1>Ship environments without building another platform.</h1>
      <p>Install the signed stable release on Kubernetes, then finish setup in the product.</p>
      <Link className="primary-link" href="/install">Open the install guide</Link>
    </main>
  );
}
