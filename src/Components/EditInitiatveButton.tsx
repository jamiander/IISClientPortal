import { Company, Initiative } from "../Store/CompanySlice";

interface EditInitiativeButtonProps {
    handleEditInitiative: (company: Company, initiative: Initiative) => void
    company: Company
    initiative: Initiative
    index: number
}

export function EditInitiativeButton(props: EditInitiativeButtonProps){
    return (
        <div key={props.index} className={'py-1 flex self-end'}>
            <button className=" mx-2 bg-[#21345b] text-sm text-white w-full h-8 rounded-md outline"
                onClick={() => props.handleEditInitiative(props.company, props.initiative)}
            >
                Edit Initiative
            </button>
        </div>
    );
}