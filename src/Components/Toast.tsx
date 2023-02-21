import { useEffect, useState } from "react";



export interface ToastDetails {
    message: string,
    type: 'Success' | 'Error' | 'Warning' | 'Info',
    id: number
}

interface ToastProps {
    toastList: ToastDetails[]
}

export default function Toast(props: ToastProps) {
    const [list, setList] = useState(props.toastList);

    useEffect(() => {
        setList([...props.toastList]);
    }, [props.toastList]);

    useEffect(() => {
        const interval = setInterval(deleteToast, 2000);
        console.log("interval: ", interval);

        return () => {
            clearInterval(interval)
        };
    }, [props.toastList, list]);

    function deleteToast() {
        if(props.toastList.length)
        {
            const id = props.toastList[0].id;

            const listItemIndex = list.findIndex(e => e.id === id);
            list.splice(listItemIndex, 1);

            const toastListItem = props.toastList.findIndex(e => e.id === id);
            props.toastList.splice(toastListItem, 1);

            setList([...list]);
        }
    }

    return (
        <div id='toast-container'>
            {
                list.map((toast, index) => 
                    <div key={index} id="toast-default" className="flex absolute bottom-10 right-5 items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"></svg>
                            <span className="sr-only">Fire icon</span>
                        </div>
                        
                        <div className="ml-3 text-sm font-normal">{toast.message}</div>
        
                        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                            <span className="sr-only">Close</span>
                            <p className="text-white">X</p>
                        </button>
        
                    </div>
                )
            }
        </div>


    )
}