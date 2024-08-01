import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Universal Document Parser Service</h1>
        <p>
          This is a service that can parse various document formats such as PDF, DOCX, PPTX, and TXT.
        </p>
      </div>
    </main>
  );
}
