import { useEffect, useState } from "react";
import { FindItemsRemaining } from "../../Services/CompanyService";
import InitiativesFilter from "../../Services/InitiativesFilter";
import { Company } from "../../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../../Store/Hooks";
import { selectCurrentUser, User } from "../../Store/UserSlice";

interface InitiativesProps {
  companyList: Company[],
  radioStatus: string,
}

export default function InitiativesTable(props: InitiativesProps) {
  const dispatch = useAppDispatch();
  const tableDataStyle = "outline outline-1 text-center ";
  const companies = props.companyList.map((company) => {
      return {'init': company.initiatives, 'name': company.name };
    }
  );

  const [isCompanyHidden, setCompanyHidden] = useState(false);

  let currentUser : User = useAppSelector(selectCurrentUser) ?? {id: -1, email: 'fake@fake', password: 'fake', companyId: -1};
  useEffect(() => {
    if (currentUser.id === 0) {
      setCompanyHidden(false);
    } else {
      setCompanyHidden(true);
    }
  }, []);
  
  return (
    <table className="table-auto w-[100%] outline outline-3">
      <thead className="outline outline-1">
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th hidden={isCompanyHidden}>Company</th>
          <th>Target Completion</th>
          <th>Total Items</th>
          <th>Items Remaining</th>
          <th>Probability</th>
        </tr>
      </thead>
      <tbody>
        {
          companies.map((company, index) => {
            return (
              (props.radioStatus !== 'all' ? InitiativesFilter(company.init, props.radioStatus) : company.init).map((initiative, index) => {
                let itemsRemaining = FindItemsRemaining(initiative);
                return (
                  <tr key={index}>
                    <td className={tableDataStyle}>{initiative.id}</td>
                    <td className={tableDataStyle}>{initiative.title}</td>
                    <td className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                    <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                    <td className={tableDataStyle}>{initiative.totalItems}</td>
                    <td className={tableDataStyle}>{itemsRemaining}</td>
                    <td></td>
                  </tr>
                )
              })
            )
          })
        }
      </tbody>
    </table>
  )
}