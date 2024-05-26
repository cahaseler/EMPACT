import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src="/empact-logo-transparent-cropped-square.png"
        alt="Logo"
        width={300}
        height={300}
      />
      <div>Work in progress - more to come!</div>
    </main>
  );
}
