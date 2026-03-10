import Topbar from "@/components/topbar";

export default function RootLayout({ children }) {
  return (
    <div>
      <Topbar/>
      {children}
    </div>
  );
}
