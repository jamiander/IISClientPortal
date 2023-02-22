interface InitiativesProps {
  // initiatives: 
}

export default function InitiativesTable(props: InitiativesProps) {
  var initiatives = [{
    id: 1,
    Title: "IIS Client Portal",
    TargetDate: {
      Month: 12,
      Day: 15,
      Year: 2023
    },
    TotalItems:"12",
    ItemsCompletedOnDate:
    [
      {Month:2, Day:17, Year:2023, ItemsCompleted: 2},
      {Month:2, Day:20, Year:2023, ItemsCompleted: 1},
      {Month:2, Day:25, Year:2023, ItemsCompleted: 4}
    ],
    ItemsRemaining: 9
  }]
  return (
    <table className="table-auto w-[100%] outline outline-3">
      <thead className="outline outline-1">
        <tr>
          <th className="w-[5%]">Status</th>
          <th>Title</th>
          <th>Target Date</th>
          <th>Total Items</th>
          <th>Items Remaining</th>
        </tr>
      </thead>
      <tbody>
        {
          initiatives.map((init, index) => {
            const style = "outline outline-1 text-center ";
            return (
              <tr key={index}>
                <td className={style}>{init.id}</td>
                <td className={style}>{init.Title}</td>
                <td className={style}>{init.TargetDate.Month + "/" + init.TargetDate.Day + "/" + init.TargetDate.Year}</td>
                <td className={style}>{init.TotalItems}</td>
                <td className={style}>{init.ItemsRemaining}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}