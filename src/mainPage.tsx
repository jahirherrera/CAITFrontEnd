import {useState} from 'react';


export default function MainPage() {

    const [activeSection, setActiveSection] = useState<number>(0);



  return (
    <div className="flex flex-col  h-screen w-full">
        <section className="flex flex-row  items-end gap-5 justify-center h-1/10 w-full bg-white">
            <div className={`text-lg font-bold  p-1.5 rounded-t-xl ${activeSection === 0 ? 'bg-gray-200'  : ''}`} onClick={() => setActiveSection(0)}>Group</div>
            <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 1 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(1)}>Questions</div>
            <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 2 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(2)}>Test</div>
            <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 3 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(3)}>Setting</div>
        </section>
        <section className="flex flex-col items-center justify-center h-9/10 w-full bg-gray-200">
            
        </section>
    </div>
  );
}