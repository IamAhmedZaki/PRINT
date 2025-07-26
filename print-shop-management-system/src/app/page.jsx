'use client';

export default function Home() {

  const handelRedirect  = () => {
    if (sessionStorage.getItem('authToken')) {
      window.location = '/dashboard'
    } else {
      window.location = '/auth/login'
    }
  }

  return (
    <div className="w-full h-[100vh] flex justify-center items-center flex-col gap-1.5 px-6">
      <h1 className="text-[48px] font-bold uppercase">Print Shop Management System</h1>
      <button onClick={handelRedirect} className="bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center px-[50px]">
        Get Started
      </button>
    </div>
  );
}
