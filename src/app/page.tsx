// The home page must prerender completely. Any request time work (cookies(),
// headers(), uncached fetches) fails the build instead of making it dynamic.
export const ensureStatic = "navigation";

export default function Home() {
  return <main />;
}
