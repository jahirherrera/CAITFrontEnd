import { useState, useEffect } from 'react';
import type { Group,GroupDetails } from './assets/type';



export default function MainPage() {

  const [groups, setGroups] = useState<Group[]>([]);
  const [addGroup, setAddGroup] = useState<boolean>(false);

  const [newGroupName, setNewGroupName] = useState<string>("");

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
      console.log("Fetched groups:", groupsData);
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
      <section className="flex flex-col items-center justify-start h-9/10 w-full bg-gray-200 p-15">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-row items-center justify-between border-2 h-20 min-h-10 min-w-100 border-gray-300 p-6 pl-6 rounded-lg shadow-2xl mb-4">
            <h2 className="text-xl font-bold mb-2 hover:cursor-pointer">{group.name}</h2>
            <button className="text-xl font-bold hover:cursor-pointer" onClick={() => deleteGroup(group.id)}>-</button>
          </div>
        ))}
        <button className="flex items-center justify-center  border border-gray-400 shadow-2xl  hover:shadow-lg hover:scale-105 transition duration-200  rounded-full text-sm h-10 w-10 hover:cursor-pointer min-w-7 min-h-7 " onClick={() => {
          setAddGroup(true);
        }}>
          +
        </button>
      </section>
      {
        addGroup && (
          <div className={`fixed top-0 left-0 w-full h-full bg-gray-700/80 flex justify-center items-center text-white  `}>
            <div className=" w-full max-w-sm h-40 min-h-35 p-6 bg-gray-200 text-black rounded-xl shadow-xl border border-gray-400 flex flex-col items-center justify-between ">
              <div className="flex flex-row items-center justify-center gap-1">
                <h2 className="text-xl font-bold mb-2">New Group</h2>
                <input type="text" placeholder="Group Name" className="border border-gray-300 rounded p-2 ml-2" value={newGroupName} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setNewGroupName(e.target.value)} />
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