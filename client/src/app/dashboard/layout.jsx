
import AdminSidebar from "@/components/AdminSideBar";


export const metadata = {
  title: "dashboard",
  description: "Social media app",

};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F9FCFF] dark:bg-[#081F5C] text-[#081F5C] dark:text-[#F9FCFF] transition-colors duration-300">
      <AdminSidebar />
      <div className="flex-1 w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
