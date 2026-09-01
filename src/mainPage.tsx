import { useState, useEffect } from 'react';
import type { Group } from './assets/type';



export default function MainPage() {

  const [groups, setGroups] = useState<Group[]>([]);

  const [activeSection, setActiveSection] = useState<number>(0);
  const username = localStorage.getItem("username");
  useEffect(() => {
    if (username) {
      getGroups();
    }
  }, []);

  const getGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/groups/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Could not fetch groups.");
      }
      const groupsData = await response.json();
      setGroups(groupsData);

    } catch (error) {
      console.error("Fetching groups failed", error);
    }
  }
  return (
    <div className="flex flex-col  h-screen w-full">
      <section className="flex flex-row  items-end gap-5 justify-center h-1/10 w-full bg-white">
        <div className={`text-lg font-bold  p-1.5 rounded-t-xl ${activeSection === 0 ? 'bg-gray-200' : ''}`} onClick={() => setActiveSection(0)}>Group</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 1 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(1)}>Questions</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 2 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(2)}>Test</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 3 ? 'bg-gray-200 ' : ''}`} onClick={() => setActiveSection(3)}>Setting</div>
      </section>
      <section className="flex flex-col items-center justify-center h-9/10 w-full bg-gray-200">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col items-center justify-center border-2 max-w-120 min-w-100 min-h-100 border-gray-300 p-4 rounded-lg shadow-2xl mb-4">
            <h2 className="text-xl font-bold mb-2">{group.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
}