import { useSelector } from "react-redux";

interface RootState {
  auth: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

function Account() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-850 rounded-[32px] p-10 text-center shadow-xl shadow-black/5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-stone-105">Not signed in</h1>
          <p className="mt-3 text-sm text-[#64748B] dark:text-stone-400">Please sign in to view your account details.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-850 rounded-[32px] p-10 shadow-xl shadow-black/5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-100">Welcome, {user.name}</h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-stone-400">Role: {user.role}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 dark:border-stone-800 p-6">
            <p className="text-sm text-[#64748B] dark:text-stone-400">Email</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-stone-200">{user.email}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 dark:border-stone-800 p-6">
            <p className="text-sm text-[#64748B] dark:text-stone-400">Account type</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-stone-200">{user.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Account;
