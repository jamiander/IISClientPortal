import './App.css';

function App() {
  return (
    <div className='grid grid-cols-5 gap-2 bg-[#21345b]'>
      <div className='col-span-5 bg-white h-[10vh]'><img src='https://static.wixstatic.com/media/4f8b60_2899998071014662a534db34be03a3d1~mv2.png/v1/fill/w_438,h_118,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Integrity-Logo_2x%20(3)_edited.png'/> </div>
      <div className='bg-[#2ed7c3] h-[80vh]'>Nav Panel</div>
      <div className='col-span-4 bg-white h-[80vh]'>Content</div>
      <div className='col-span-5 bg-[#2ed7c3] h-[10vh]'>Footer</div>
    </div>
  );
}

export default App;
