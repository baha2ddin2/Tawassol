import { Work_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/storeComponent";
import "goey-toast/styles.css";

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: "Tawassol",
  description: "Social media app",

};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${workSans.className} antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
