import { useNavigate } from "react-router-dom"

export default function NavPanel(){
    const navigate = useNavigate()
    return(
        <div className="space-y-3">
            <text className="text-3xl w-[100%] outline">Nav Panel</text>
            <button className="outline bg-[#2ed7c3] h-[40px] w-[100%] rounded" onClick={()=>navigate('/Dashboard')}>Dashboard</button>
            <button className="outline bg-[#2ed7c3] h-[40px] w-[100%] rounded" onClick={()=>navigate('/Admin')}>Admin</button>
        </div>
        
    )
}