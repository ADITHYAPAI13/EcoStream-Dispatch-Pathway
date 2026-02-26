import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm p-8">
      <div className="flex items-center gap-2 text-rose-300 font-semibold">
        <TriangleAlert size={18} className="text-rose-400" />
        Page not found
      </div>
      <p className="mt-2 text-sm text-slate-300">The page you requested doesn’t exist.</p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-white font-semibold hover:bg-emerald-700"
      >
        Go back home
      </Link>
    </div>
  );
}
