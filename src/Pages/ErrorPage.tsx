import { isRouteErrorResponse, useRouteError } from "react-router";

interface ErrorProps {
  devMessage?: string
}

export default function ErrorPage(props: ErrorProps) {

  const error = useRouteError();
  var headElement = <></>
  var textElement = <></>

  function errorFunc() {

    if (isRouteErrorResponse(error)){
      headElement = <h3 className="p-1">{error.status} Error</h3>
      switch (error.status) {
        case 401: textElement = <p>You must be authenticated to access this content.</p>; break;
        case 403:  textElement = <p>You do not have the privilege for this content.</p>; break;
        case 404: textElement = <p>The requested page cannot be found.</p>; break;
        case 500: textElement = <p>There has been a server error. Please try again later.</p>; break;
        case 501: textElement = <p>The request method has not been implemented.</p>; break;
        case 502: textElement = <p>The server recieved an invalid response.</p>; break;
        case 503: textElement = <p>The server is unprepared for this task.</p>; break;
        default: textElement = <p>Sorry, there has been an error.</p>; break;
      }
    }
  }
  return (
    <div className="m-4">
    <>
      {errorFunc()}

      {headElement}
      <p className='pb-1'>Oh no! You've encountered an error.</p>
      {textElement}
      <p>{props.devMessage}</p>
      <a href="./">
        <button className="outline hover:bg-[#445362] bg-[#21345b] text-white p-2 px-3 rounded-md">Return</button>
      </a>
    </>
    </div>
  )
}