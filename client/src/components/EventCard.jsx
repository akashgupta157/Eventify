import { Link } from "react-router";
import { useSelector } from "react-redux";

const EventCard = ({ event }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
        <p className="text-gray-500 text-sm">
          {new Date(event.date).toDateString()}
        </p>
        <p className="text-gray-700 mt-2 text-sm line-clamp-2">
          {event.description}
        </p>
        <div className="my-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {event.category}
          </span>
        </div>
        <div className="mt-4">
          <Link
            to={user ? `/events/${event._id}` : "/login"}
            className="inline-block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
