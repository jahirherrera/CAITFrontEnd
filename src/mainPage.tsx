import { useState, useEffect } from 'react';
import type { Group, GroupDetails } from './assets/type';
import ShowQues from './showQues.tsx';
//@ts-ignore
import sprite from './assets/sprite.svg';



export default function MainPage() {

  const [groups, setGroups] = useState<Group[]>([]);
  const [addGroup, setAddGroup] = useState<boolean>(false);

  const [newGroupName, setNewGroupName] = useState<string>("");

  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [activeQuestions, setActiveQuestions] = useState<boolean>(false);

  const [activeSection, setActiveSection] = useState<number>(0);
  const username = localStorage.getItem("username");
  useEffect(() => {
    if (username) {
      getGroups();
    }
  }, []);

  const addNewGroup = async () => {
    const groupDetails: GroupDetails = {
      name: newGroupName,
      user_username: username || ""
    };

    if (newGroupName.trim() === "") {
      alert("Group name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/addGroup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(groupDetails)
      });

      if (!response.ok) {
        throw new Error("Could not create group.");
      }
      setNewGroupName("");
      setAddGroup(false);
      getGroups();
    } catch (error) {
      console.error("Adding group failed", error);
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/groups/${groupId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Could not delete group.");
      }
      getGroups();
    } catch (error) {
      console.error("Deleting group failed", error);
    }
  };

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

  const goToQuestions = (groupId: number) => {
    setSelectedGroupId(groupId);
  }

  useEffect(() => {
    if (selectedGroupId !== 0) {
      setActiveSection(1);
      setActiveQuestions(true);
    }
  }, [selectedGroupId]);

  return (
    <div className="grid grid-rows-[1fr_11fr] h-screen w-full ">
      <section className="flex flex-row  items-end gap-5 justify-center h-auto w-full bg-white mt-5">
        <div className={`text-lg font-bold  p-1.5 rounded-t-xl ${activeSection === 0 ? 'bg-gray-200' : ''}`} onClick={() => { setActiveSection(0); setActiveQuestions(false); setSelectedGroupId(0); }} >Group</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 1 ? 'bg-gray-200 ' : ''}`} >Questions</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 2 ? 'bg-gray-200 ' : ''}`} >Test</div>
        <div className={`text-lg font-bold rounded-t-xl p-1.5 ${activeSection === 3 ? 'bg-gray-200 ' : ''}`} >Setting</div>
      </section>
      {!activeQuestions && <section className="flex flex-col items-center justify-start h-full w-full bg-gray-200 p-8">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-row items-center justify-between border-2 h-25  min-w-100 border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2 hover:cursor-pointer" onClick={() => goToQuestions(group.id)}>
                {group.name}
              </h2>
              <h4 className="text-xs text-gray-600">Next review at...</h4>
            </div>

            <button className="text-xl font-bold hover:cursor-pointer" ><svg
              className="w-6 h-6 text-black hover:cursor-pointer"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              onClick={() => deleteGroup(group.id)}
            >
              <use href={`${sprite}#trash`} />
            </svg></button>
          </div>
        ))}
        <button className="flex items-center justify-center  border border-gray-400 shadow-2xl  hover:shadow-lg hover:scale-105 transition duration-200  rounded-full text-sm h-10 w-10 hover:cursor-pointer min-w-7 min-h-7 " onClick={() => {
          setAddGroup(true);
        }}>
          +
        </button>
      </section>
      }
      {
        activeQuestions && <ShowQues groupId={selectedGroupId} />
      }
      {
        addGroup && (
          <div className={`fixed top-0 left-0 w-full h-full bg-gray-700/80 flex justify-center items-center text-white  `}>
            <div className=" w-full max-w-sm h-40 min-h-35 p-6 bg-gray-200 text-black rounded-xl shadow-xl border border-gray-400 flex flex-col items-center justify-between ">
              <div className="flex flex-row items-center justify-center gap-1">
                <h2 className="text-xl font-bold mb-2">New Group</h2>
                <input type="text" placeholder="Group Name" className="border border-gray-300 rounded p-2 ml-2" value={newGroupName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGroupName(e.target.value)} />
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={addNewGroup}>Save</button>
                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => setAddGroup(false)}>Cancel</button>
              </div>
            </div>
          </div>

        )
      }
    </div>
  );
}