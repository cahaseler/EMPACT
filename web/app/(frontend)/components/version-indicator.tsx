export function VersionIndicator() {
  const version = { version: "1.4.10" };
  return <div>{"v" + version.version}</div>;
}
