import { Work_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/storeComponent";
import "goey-toast/styles.css";
import ThemeProvider from "@/components/ThemeProvider";
import I18nProvider from "@/components/I18nProvider";

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: "Tawassol | Connect & Share",
  description: "A modern social networking platform focused on connecting developers, trainers, and professionals worldwide.",
  keywords: ["Tawassol", "Social Network", "Developers", "Trainers", "Real-time Chat", "Community", "Morocco"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.className} antialiased`}>
        <ReduxProvider>
          <I18nProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
