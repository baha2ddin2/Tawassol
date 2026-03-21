import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({ children }) {
  return (
    <div>
      <Topbar/>
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
