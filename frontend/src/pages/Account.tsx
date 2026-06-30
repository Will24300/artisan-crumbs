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
        <div className="max-w-xl w-full bg-white rounded-[32px] p-10 text-center shadow-xl shadow-black/5">
          <h1 className="text-2xl font-bold">Not signed in</h1>
          <p className="mt-3 text-sm text-[#64748B]">Please sign in to view your account details.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-[32px] p-10 shadow-xl shadow-black/5">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="mt-3 text-sm text-[#64748B]">Role: {user.role}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="text-sm text-[#64748B]">Email</p>
            <p className="mt-2 font-semibold text-gray-900">{user.email}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="text-sm text-[#64748B]">Account type</p>
            <p className="mt-2 font-semibold text-gray-900">{user.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Account;
