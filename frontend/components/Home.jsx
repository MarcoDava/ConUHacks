"use client"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <section className="mb-8">
        <img src={"/GitTissueLogo.png"} className="w-24 h-24 rounded-full mb-2"/>
        <p className="mb-4">
          This is your one-stop solution for managing projects with an efficiently designed Kanban board. 
          Easily track tasks, manage your team, and stay organized.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside">
          <li>Drag and drop task management</li>
          <li>Real-time collaboration</li>
          <li>Customizable workflows</li>
          <li>Team management</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Get Started</h2>
        <p className="mb-4">
          To get started, create a new project or visit the Kanban board to see your tasks.
        </p>
      </section>
    </main>
  );
}