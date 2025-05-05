import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-6" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Canceled</h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        Your payment was not completed. If this was a mistake, you can try again or contact support.
      </p>
      <div className="flex gap-4">
        <Link href="/cart">
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition">
            Try Again
          </button>
        </Link>
        <Link href="/">
          <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
