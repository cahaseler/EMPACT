export function VersionIndicator() {
  const version = { version: "1.7.8" };
  return <div>{"v" + version.version}</div>;
}
