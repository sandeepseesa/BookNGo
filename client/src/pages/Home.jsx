import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import BASE_URL from "../config.js";

const Home = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchpackages();
  }, []);

  const fetchpackages = async () => {

    const response = await axios.get(`${BASE_URL}/package`);
    const newestPackages = response.data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setPackages(newestPackages);
  }

  return (
    <div className="font-sans">

      <section
        className="relative text-center h-[75vh] w-[100%] bg-cover bg-center text-white"
        style={{ backgroundImage: "url(185289.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Explore the World with Us
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Discover amazing travel packages, handpicked for unforgettable experiences.
          </p>
          <a href="#packages" className="bg-yellow-500 text-black py-2 px-4 md:py-3 md:px-6 rounded-lg hover:bg-yellow-400 transition">
            Explore Our Packages
          </a>
        </div>

      </section>


      {/* Featured Packages Section */}
      <section id="packages" className="px-8 p-8 md:px-16 md:pb-16 text-center relative -top-24">
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">
              Top Travel Packages
            </h2>
            <p className="text-gray-600">
              Explore our top travel packages designed for your ultimate adventure!
            </p>

          </div>
        </div>
      

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">

          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition duration-300"
            >
              {/* <img
                src={`images/${pkg.name}` || "https://via.placeholder.com/400x250"}
                alt={`Package ${pkg.name}`}
                className="w-full h-[30vh] object-cover rounded-t-lg"
              /> */}
              <h2 className="text-xl font-semibold text-orange-500">{pkg.title}</h2>
              <p className="text-blue-700 mt-2">Destination: {pkg.destination}</p>
              <h3 className="text-xl text-blue-600 font-semibold mt-4">
                {pkg.name}
              </h3>
              
              <p className="text-gray-700 mt-2">{pkg.description}</p>
              <p className="text-gray-900 mt-2 font-semibold">Price: ${pkg.price}</p>
      <p className="text-gray-600 mt-2">
        Available Dates: {pkg.availableDates.map(date => 
          new Date(date).toLocaleDateString()
        ).join(", ")}
      </p>
      <p className="text-gray-600 mt-2">Max Travelers: {pkg.maxTravelers}</p>
              <button onClick={() => navigate('/packages')} className="mt-4 bg-blue-500 text-white py-2 w-full rounded-lg hover:bg-blue-600 transition">
                Book Now
              </button>
            </div>
          ))}

        </div>

        {/* View All Packages Button */}
        <div className="text-center mt-8">
          <Link
            to="/packages"
            className="inline-block mt-6 bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-400 transition"
          >
            View All Packages
          </Link>
        </div>
      </section>

      <section id="about" className="bg-gray-100 py-16 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600">Why Travel with Us?</h2>
        <p className="mt-4 text-gray-600">We offer exclusive deals, exceptional service, and unforgettable experiences!</p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Exclusive Deals</h3>
          <p className="text-gray-600">Get access to special discounts and exclusive offers on your travel bookings.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">24/7 Support</h3>
          <p className="text-gray-600">Our dedicated customer support team is available around the clock to assist you.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Tailored Experiences</h3>
          <p className="text-gray-600">We create personalized itineraries based on your preferences and needs.</p>
        </div>
      </div>
    </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50 transition">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600">Real stories from satisfied travelers.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <p className="italic text-gray-700">
              "BookNGo made my vacation to Maldives seamless. Incredible service and deals!"
            </p>
            <h4 className="mt-4 font-bold text-gray-800">- Emily R.</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <p className="italic text-gray-700">
              "Booking flights and hotels was so easy. Highly recommend BookNGo!"
            </p>
            <h4 className="mt-4 font-bold text-gray-800">- Michael T.</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 BookNGo. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="https://www.facebook.com" className="hover:text-yellow-500 transition">
              Facebook
            </a>

            <a href="https://www.twitter.com" className="hover:text-yellow-500 transition">
              Twitter
            </a>

            <a href="https://www.instagram.com" className="hover:text-yellow-500 transition">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
    
  );
};

export default Home;
