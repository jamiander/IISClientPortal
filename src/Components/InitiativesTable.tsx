import { useEffect, useState } from "react";
import ActiveInitiativesFilter from "../Services/ActiveInitiativesFilter";
import InactiveInitiativesFilter from "../Services/InactiveInitiativesFilter";
import { Company } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser, User } from "../Store/UserSlice";

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
  
  if(props.radioStatus === 'active'){
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
                ActiveInitiativesFilter(company.init).map((initiative, index) => {
                  const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
                  var total = 0;
                  itemsCompleted.forEach((num) => total += num);
                  return (
                    <tr key={index}>
                      <td className={tableDataStyle}>{initiative.id}</td>
                      <td className={tableDataStyle}>{initiative.title}</td>
                      <td className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                      <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                      <td className={tableDataStyle}>{initiative.totalItems}</td>
                      <td className={tableDataStyle}>{initiative.totalItems - total}</td>
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
  else if(props.radioStatus === 'inactive'){
    return(
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
                InactiveInitiativesFilter(company.init).map((initiative, index) => {
                  const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
                  var total = 0;
                  itemsCompleted.forEach((num) => total += num);
                  return (
                    <tr key={index}>
                      <td className={tableDataStyle}>{initiative.id}</td>
                      <td className={tableDataStyle}>{initiative.title}</td>
                      <td className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                      <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                      <td className={tableDataStyle}>{initiative.totalItems}</td>
                      <td className={tableDataStyle}>{initiative.totalItems - total}</td>
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
  else{
    return(
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
                company.init.map((initiative, index) => {
                  const itemsCompleted = initiative.itemsCompletedOnDate.map((item) => item.itemsCompleted);
                  var total = 0;
                  itemsCompleted.forEach((num) => total += num);
                  return (
                    <tr key={index}>
                      <td className={tableDataStyle}>{initiative.id}</td>
                      <td className={tableDataStyle}>{initiative.title}</td>
                      <td className={tableDataStyle} hidden={isCompanyHidden}>{company.name}</td>
                      <td className={tableDataStyle}>{initiative.targetDate.month + "/" + initiative.targetDate.day + "/" + initiative.targetDate.year}</td>
                      <td className={tableDataStyle}>{initiative.totalItems}</td>
                      <td className={tableDataStyle}>{initiative.totalItems - total}</td>
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
}