import React from "react";
import { useState } from "react";

const Auction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctions, setAuctions] = useState([
    { id: 1, name: "Auction 1", status: "Upcoming" },
    { id: 2, name: "Auction 2", status: "Active" },
    { id: 3, name: "Auction 3", status: "Completed" },
  ]);

  const toggleAuctionStatus = (id) => {
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === id
          ? {
              ...auction,
              status: auction.status === "Active" ? "Completed" : "Active",
            }
          : auction
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Auction Management</h1>

      {/* Auction List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Auctions</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Player
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3">Auction Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.id} className="border-b border-gray-600">
                <td className="p-3">{auction.name}</td>
                <td className="p-3">{auction.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleAuctionStatus(auction.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    {auction.status === "Active" ? "End" : "Start"}
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Add Player for Auction
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Player Name"
                className="p-2 bg-gray-700 rounded"
              />
              <select className="p-2 bg-gray-700 rounded">
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="allrounder">All-Rounder</option>
              </select>
              <input
                type="number"
                placeholder="Base Price"
                className="p-2 bg-gray-700 rounded"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Player
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Auction;
