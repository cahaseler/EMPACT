export function VersionIndicator() {
  const version = { version: "1.4.8" };
  return <div>{"v" + version.version}</div>;
}
