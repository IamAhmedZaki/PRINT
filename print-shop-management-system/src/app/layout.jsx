import AuthProvider from "./components/AuthProvider/AuthProvider";
import "./CSS/globals.css";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
})

export const metadata = {
  title: "Print Shop Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
