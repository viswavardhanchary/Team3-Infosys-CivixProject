import { SideBar } from "../components/SideBar"

export const Dashboard = () => {
  return <>
    <div className='w-full flex gap-1'>
      <SideBar/>
      <div className="text-black">Content</div>
    </div>
  </>
}