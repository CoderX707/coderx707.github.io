const RemunerationDisplay = () => {
  const data = [
    { name: "John Doe", role: "Developer", salary: "$5000" },
    { name: "Jane Smith", role: "Designer", salary: "$4500" },
  ];

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md shadow-lg">
      <h2 className="text-xl mb-2">Remuneration Details</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b border-gray-600 p-2">Name</th>
            <th className="border-b border-gray-600 p-2">Role</th>
            <th className="border-b border-gray-600 p-2">Salary</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.role}</td>
              <td className="p-2">{item.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemunerationDisplay;
