export function VersionIndicator() {
  const version = { version: "1.9.4" };
  return <div>{"v" + version.version}</div>;
}
