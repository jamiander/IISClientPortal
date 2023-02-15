import './App.css';
import Content from './Layout/Content';
import Footer from './Layout/Footer';
import Header from './Layout/Header';
import NavPanel from './Layout/NavPanel';

function App() {
  return (
    <div className='grid grid-cols-5 gap-2 bg-[#21345b]'>
      <div className='col-span-5 bg-white h-[10vh]'><Header/></div>
      <div className='bg-[#2ed7c3] h-[80vh]'><NavPanel/></div>
      <div className='col-span-4 bg-white h-[80vh]'><Content/></div>
      <div className='col-span-5 bg-[#2ed7c3] h-[10vh]'><Footer/></div>
    </div>
  );
}

export default App;
