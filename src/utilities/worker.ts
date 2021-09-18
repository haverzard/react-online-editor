export default function createBundler() {
  return new Worker(new URL("../workers/Bundler.worker.ts", import.meta.url), { name: "cBundler v.0.1.0" });
}
