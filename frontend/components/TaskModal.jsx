// frontend/components/TaskModal.jsx
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/solid";

const colors = [
    "bg-gray-200",
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
  ]

  const teamMembers = [
    { id: 1, name: "Alice Johnson", image: "/huzz1.jpg" },
    { id: 2, name: "Bob Smith", image: "/huzz2.jpg" },
    { id: 3, name: "Charlie Brown", image: "/huzz3.jpg" },
    { id: 4, name: "Diana Prince", image: "/huzz4.jpg" },
    { id: 5, name: "Ethan Hunt", image: "/huzz5.jpg" },
  ];

export default function TaskModal({ task, isOpen, onClose, updateTask }) {
  const [content, setContent] = useState(task.content);
  const [description, setDescription] = useState(task.description || "");
  const [color, setColor] = useState(task.color || "bg-gray-200");
  const [githubLink, setGithubLink] = useState(task.githubLink || "");
  const [assignedMember, setAssignedMember] = useState(task.assignedMember || null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingGithubLink, setIsEditingGithubLink] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(task.id, content, color, description, githubLink, assignedMember);
    onClose();
  };

  const handleCancelTitleEdit = () => {
    setContent(task.content);
    setIsEditingTitle(false);
  };

  const handleCancelGithubLinkEdit = () => {
    setGithubLink(task.githubLink || "");
    setIsEditingGithubLink(false);
  };

  const handleCancelDescriptionEdit = () => {
    setDescription(task.description || "");
    setIsEditingDescription(false);
  };

  if (!isOpen) return null;

return (
    <div className={`fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`p-6 rounded-xl shadow-lg w-3/4 ${color} transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} border-2 border-gray-500`}>
            <div className="flex space-x-2">
                {colors.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className={`mb-3 w-6 h-6 rounded-full ${c} ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                        onClick={() => setColor(c)}
                    />
                ))}
            </div>
            <form onSubmit={handleSubmit} className={`flex flex-col space-y-4 transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            <div className="flex items-center mb-4 space-x-4">
            <div className="flex items-center ">
            {isEditingTitle ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border rounded-xl p-2 flex-grow"
                  placeholder="Task Name"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(false)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelTitleEdit}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <h2 className="text-xl font-bold flex-grow">{content}</h2>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            )}
            </div>
            <div className="flex items-center">
            {isEditingGithubLink ? (
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="border rounded-xl p-2 flex-grow"
                  placeholder="GitHub Issue Link"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingGithubLink(false)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelGithubLinkEdit}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <p className="flex-grow text-gray-500">{githubLink || "Add GitHub Issue Link..."}</p>
                <button
                  type="button"
                  onClick={() => setIsEditingGithubLink(true)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          </div>
          <div className="flex items-center mb-4">
          {isEditingDescription ? (
              <div className="flex flex-col w-full">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded-xl p-2 flex-grow"
                  placeholder="Task Description"
                  rows="4"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDescription(false)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDescriptionEdit}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="flex-grow text-gray-500">{description || "Write a description..."}</p>
                <button
                  type="button"
                  onClick={() => setIsEditingDescription(true)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
            
            <div className="flex items-center mb-4">
            <div className="flex space-x-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="relative group">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-2.5rem] px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsTextBoxVisible(!isTextBoxVisible)}
              className="ml-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full transition duration-300"
            >
              Find the Best Candidate
            </button>
          </div>
          {isTextBoxVisible && (
            <textarea
              className="border rounded-xl p-2 w-full mb-4"
              placeholder="Generated text from ChatGPT..."
              rows="4"
            />
          )}
          <div className="flex items-center mb-4">
            <label className="mr-2">Assign</label>
            <select
              value={assignedMember ? assignedMember.id : ""}
              onChange={(e) => {
                const member = teamMembers.find((m) => m.id === parseInt(e.target.value));
                setAssignedMember(member);
              }}
              className="border rounded-xl p-2"
            >
              <option value="">Select a team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <span className="ml-2">to task</span>
          </div>
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 transition duration-300 rounded-full">
                        Save
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 transition duration-300 rounded-full">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}