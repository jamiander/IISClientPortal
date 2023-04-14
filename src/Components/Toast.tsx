import { useEffect, useState } from "react";

export interface ToastDetails {
    message: string,
    type: 'Success' | 'Error' | 'Warning' | 'Info',
    id: number
}

interface ToastProps {
    toastList: ToastDetails[]
}

export const ToastId = 'toast-default';

export default function Toast(props: ToastProps) {
  const [list, setList] = useState(props.toastList);

  useEffect(() => {
    setList([...props.toastList]);
  }, [props.toastList]);

  useEffect(() => {
    const interval = setInterval(deleteToast, 5000);

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
          <div key={index} id={ToastId} className="flex absolute bottom-10 right-10 z-50 items-center w-full max-w-xs p-4 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-[#21345b]" role="alert">
  
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-[#2ed7c3] dark:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            
            <div className="ml-3 text-sm font-normal text-black dark:text-white">{toast.message}</div>

            <button type="button" data-dismiss-target="#toast-default" aria-label="Close" onClick={() => deleteToast()}
              className="ml-auto -mx-1.5 -my-1.5 bg-white hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-[#21345b] dark:hover:bg-gray-700">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

            </button>

          </div>
        )
      }
    </div>
  )
}