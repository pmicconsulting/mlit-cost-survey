import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/mlit_logo.png"
                alt="国土交通省"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © 2025 Ministry of Land, Infrastructure, Transport and Tourism. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
