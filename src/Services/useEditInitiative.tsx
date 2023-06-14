import { useState } from "react";
import { useAppDispatch } from "../Store/Hooks";
import { Company, Initiative, upsertInitiativeInfo } from "../Store/CompanySlice";
import ValidateNewInitiative, { ValidationFailedPrefix } from "./Validation";
import { enqueueSnackbar } from "notistack";
import { InitCompanyDisplay } from "../Components/Initiative/InitiativesTable";
import { DateInfo } from "./CompanyService";

enum stateEnum {
  start,
  edit,
  add
}

type EditInitiative = {
  SetupEditInitiative: (initiatives: InitCompanyDisplay[]) => void
  EnterEditMode: (initId: string, companyId: string, displayList: InitCompanyDisplay[], newInit: boolean) => void
  InEditMode: () => boolean
  LeaveEditMode: () => void
  SaveEdit: (companyList: Company[]) => void
  CancelEdit: () => void
  initToEditId: string
  currentTitle: string
  setCurrentTitle: (value: string) => void
  currentStartDate: DateInfo | undefined
  setCurrentStartDate: (value: React.SetStateAction<DateInfo | undefined>) => void
  currentTargetDate: DateInfo | undefined
  setCurrentTargetDate: (value: React.SetStateAction<DateInfo | undefined>) => void
  currentTotalItems: number
  setCurrentTotalItems: (value: number) => void
  companyToEditId: string
  setCompanyToEditId: (value: string) => void
  displayItems: InitCompanyDisplay[]
}

export function useEditInitiative(setAddInitiative: (value: boolean) => void) : EditInitiative
{
  const dispatch = useAppDispatch();
  const [state, setState] = useState(stateEnum.start);
  const [initToEditId, setInitToEditId] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState<DateInfo>();
  const [currentTargetDate, setCurrentTargetDate] = useState<DateInfo>();
  const [currentTotalItems, setCurrentTotalItems] = useState(1);
  const [companyToEditId, setCompanyToEditId] = useState("");
  const [displayItems, setDisplayItems] = useState<InitCompanyDisplay[]>([])
    
  function SetupEditInitiative(initiatives: InitCompanyDisplay[])
  {
    setDisplayItems(initiatives);
    //LeaveEditMode();
  }
  
  function InEditMode()
  {
    return state === stateEnum.edit || state === stateEnum.add;
  }

  function EnterEditMode(initId: string, companyId: string, displayList: InitCompanyDisplay[], newInit: boolean)
  {
    if(!InEditMode())
    {
      const currentItem = displayList.find(i => i.id === initId);
      if(currentItem)
      {
        setState(newInit ? stateEnum.add : stateEnum.edit);
        setInitToEditId(initId);
        setCompanyToEditId(companyId);  //might not need this
        setCurrentTitle(currentItem.title);
        setCurrentStartDate(currentItem.startDate);
        setCurrentTargetDate(currentItem.targetDate);
        setCurrentTotalItems(currentItem.totalItems);
      }
      else
        enqueueSnackbar("Could not find the initiative to edit.",{variant: "error"});
    }
  }

  function LeaveEditMode()
  {
    setState(stateEnum.start);
    setInitToEditId("");
    setCompanyToEditId("");
  }

  function SaveEdit(companyList: Company[])
  {
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;

    const matchingCompany = companyList.find(c => c.id === companyToEditId);
    if(matchingCompany)
    {
      let matchingInit = matchingCompany.initiatives.find(i => i.id === initToEditId) ?? displayItems.find(i => i.id === initToEditId);        
      if(matchingInit)
      {
        const invalidDate: DateInfo = {
          day: -1,
          month: -1,
          year: -1
        }
        let newInitiative: Initiative = {
          id: matchingInit.id,
          title: currentTitle,
          targetDate: currentTargetDate ?? invalidDate,
          startDate: currentStartDate ?? invalidDate,
          totalItems: currentTotalItems,
          itemsCompletedOnDate: matchingInit.itemsCompletedOnDate,
          decisions: matchingInit.decisions
        }

        const validation = ValidateNewInitiative(newInitiative, companyToEditId, companyList);
        if(validation.success)
        {
          let saveMessage = "Changes have been saved.";
          if(state === stateEnum.add)
            saveMessage = "New initiative added!";
            
          dispatch(upsertInitiativeInfo({isTest: isTest, initiative: newInitiative, companyId: companyToEditId}));
          setAddInitiative(false);
          LeaveEditMode();
          enqueueSnackbar(saveMessage, {variant: "success"});
        }
        else
          enqueueSnackbar(ValidationFailedPrefix + validation.message, {variant: "error"});
      }
    }
  }

  function CancelEdit()
  {
    if(state === stateEnum.add && initToEditId !== "")
    {
      const displayClone: InitCompanyDisplay[] = displayItems.filter(i => i.id !== initToEditId);
      setDisplayItems(displayClone);
    }
    setAddInitiative(false);
    LeaveEditMode();
  }

  return {
    SetupEditInitiative,
    EnterEditMode,
    LeaveEditMode,
    InEditMode,
    SaveEdit,
    CancelEdit,
    initToEditId,
    currentTitle,
    setCurrentTitle,
    currentStartDate,
    setCurrentStartDate,
    currentTargetDate,
    setCurrentTargetDate,
    currentTotalItems,
    setCurrentTotalItems,
    companyToEditId,
    setCompanyToEditId,
    displayItems
  }
}