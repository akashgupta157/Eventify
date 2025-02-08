import axios from "axios";
import EventCard from "./EventCard";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const categories = [
    "All",
    "Technology",
    "Health",
    "Business",
    "Welfare",
    "Entertainment",
    "Sports",
    "Politics",
    "Science",
    "Culture",
    "Religion",
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_URL}/api/event`;

      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (date) params.append("date", date);

      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await axios.get(url);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, date]);

  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No events found.</p>
      )}
    </div>
  );
}
