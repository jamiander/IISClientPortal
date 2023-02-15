export default function ProfilePage(){
  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <text className="text-5xl">Profile</text>
      </div>
      <div>
        <text>user.company</text>
      </div>
      <div>
        <text>user.name</text>
      </div>
      <div>
        <text>user.email</text>
      </div>
      <div>
        <text>user.password</text>
      </div>
    </div>
  )
}