import Image from "next/image"

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-start p-24">
      <Image
        src="/empact-logo-transparent-cropped-square.png"
        alt="Logo"
        width={300}
        height={300}
      />
      <div>Work in progress - more to come!</div>
    </div>
  )
}
