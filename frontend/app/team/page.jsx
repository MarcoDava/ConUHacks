const teamMembers = [
    { id: 1, name: "Alice Johnson", image: "/huzz1.jpg" },
    { id: 2, name: "Bob Smith", image: "/huzz2.jpg" },
    { id: 3, name: "Charlie Brown", image: "/huzz3.jpg" },
    { id: 4, name: "Diana Prince", image: "/huzz4.jpg" },
    { id: 5, name: "Ethan Hunt", image: "/huzz5.jpg" },
  ];

export default function TeamPage() {
    return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Collaborators</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <h2 className="text-lg font-semibold">{member.name}</h2>
              </div>
            ))}
          </div>
        </div>
      );
    }