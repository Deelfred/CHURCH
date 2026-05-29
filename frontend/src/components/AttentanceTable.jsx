function AttendanceTable({ data }) {
  return (
    <div className="overflow-x-auto">
      
      <table className="w-full border border-zinc-700 text-white">
        
        {/* HEADER */}
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Service</th>
            <th className="p-3 text-left">Time</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="border-t border-zinc-700">
                
                <td className="p-3">{item.name}</td>

                <td className="p-3">{item.phone}</td>

                <td className="p-3">{item.service}</td>

                <td className="p-3">
                  {new Date(item.time).toLocaleString()}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-6 text-center text-gray-400">
                No attendance records yet
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}

export default AttendanceTable;