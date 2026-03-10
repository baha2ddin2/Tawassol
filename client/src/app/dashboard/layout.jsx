
import AdminSidebar from "@/components/adminSideBar";


export const metadata = {
  title: "dashboard",
  description: "Social media app",

};
export default function Layout({ children }) {
  return (
        <div className=" flex" >
          <AdminSidebar className=' flex-1' />
          <div className="w-full h-full" >
            {children}
          </div>
        </div>
  );
}
