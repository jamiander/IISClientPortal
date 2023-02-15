import { useNavigate } from "react-router-dom"

export default function NavPanel(){
  const navigate = useNavigate()
  return(
    <div className="m-[2%] space-y-3">
      <p className="text-3xl w-[100%]">Nav Panel</p>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Dashboard')}>Dashboard</button>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Admin')}>Admin</button>
      <button className="outline bg-[#21345b] text-white h-[40px] w-[100%] rounded" onClick={()=>navigate('/Profile')}>Proflie</button>
    </div>  
  )
}