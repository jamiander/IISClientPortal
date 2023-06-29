import { useState } from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

interface ReactQuillWrapperProps {
  initialValue: string
  valueSetter: (value: string) => void
}

export function ReactQuillWrapper(props: ReactQuillWrapperProps)
{
  const [text, setText] = useState(props.initialValue);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }]
    ],
  },

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent'
  ]
  
  function handleChange(value: string){
    props.valueSetter(value);
    setText(value);
  }

  return (
    <div>
      <ReactQuill value={text}
        modules={modules}
        formats={formats}
        onChange={handleChange} />
    </div>
  )
}

