import axios from "axios";
import { configure } from "@/utils";
import { io } from "socket.io-client";
import Footer from "@/components/Footer";
import { useParams } from "react-router";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const config = configure(user?.token);
  const socket = io(`${import.meta.env.VITE_URL}`);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/api/event/${id}`
        );
        setEvent(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    fetchEvent();

    socket.on("attendeeUpdated", (data) => {
      if (data.eventId === id) {
        setEvent((prev) => ({
          ...prev,
          attendees: data.attendees,
        }));
      }
    });

    return () => {
      socket.off("attendeeUpdated");
    };
  }, [id]);

  const handleRegister = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/event/${id}/register`,
        {},
        config
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-8">Event not found</div>;
  }

  const isAttendee = event.attendees.some(
    (attendee) => attendee._id === user._id
  );

  return (
    <>
      <div className="bg-gray-800 text-white">
        <Navbar />
      </div>
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <img
            src={event.image || "https://via.placeholder.com/400x200"}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x200";
            }}
          />

          <h1 className="text-3xl font-bold mt-4 mb-2">{event.name}</h1>

          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {event.category}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(event.date).toDateString()}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {event.location}
              </p>
            </div>
            {user._id !== event.createdBy._id && !isAttendee && (
              <Button
                onClick={handleRegister}
                className="bg-blue-500 text-white"
              >
                Register
              </Button>
            )}
            {isAttendee && (
              <p className="text-green-600 font-semibold">
                You are registered!
              </p>
            )}
          </div>

          <p className="text-gray-700 mb-6">{event.description}</p>

          <div className="text-sm text-gray-500 mb-6">
            <p>
              <span className="font-semibold">Created By:</span>{" "}
              {event.createdBy.name} | {event.createdBy.email}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Attendees</h3>
            <ul className="space-y-1">
              {event.attendees.length > 0 ? (
                event.attendees.map((attendee, index) => (
                  <li key={attendee._id} className="text-gray-600">
                    {index + 1}. {attendee.name} | {attendee.email}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No attendees yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetails;
