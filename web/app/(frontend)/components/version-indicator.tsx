export function VersionIndicator() {
  const version = { version: "1.13.1" };
  return <div>{"v" + version.version}</div>;
}
