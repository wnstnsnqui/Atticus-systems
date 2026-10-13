import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link href="/">Back to home</Link>
    </main>
  );
}
