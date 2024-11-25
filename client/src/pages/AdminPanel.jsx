import React, { useEffect, useState } from "react";
import axios from "axios";
import ManagePackages from "../components/admin/ManagePackages";
import ManageBookings from "../components/admin/ManageBookings";
import CreatePackageModal from "../components/admin/CreatePackageModal";
import MessageAlert from "../components/admin/MessageAlert";
import TabNavigation from "../components/admin/TabNavigation";
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("packages");
  const [newPackage, setNewPackage] = useState({
    destination: "",
    title: "",
    description: "",
    price: "",
    availableDates: [],
    maxTravelers: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = axios.defaults.headers.common['Authorization'];
      const config = {
        headers: { Authorization: token }
      };

      const packagesResponse = await axios.get(
        "https://bookngo-server.onrender.com/package", 
        config
      );
      const bookingsResponse = await axios.get(
        "https://bookngo-server.onrender.com/booking", 
        config
      );
      
      setPackages(packagesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        delete axios.defaults.headers.common['Authorization'];
        navigate('/admin/login');
      }
      enqueueSnackbar(
        error.response?.data?.message || "Error fetching data", 
        { variant: 'error' }
      );
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      const token = axios.defaults.headers.common['Authorization'];
      await axios.post(
        "https://bookngo-server.onrender.com/package",
        newPackage,
        {
          headers: { Authorization: token }
        }
      );
      
      enqueueSnackbar('Package created successfully!', { variant: 'success' });
      setIsModalOpen(false);
      setNewPackage({
        destination: "",
        title: "",
        description: "",
        price: "",
        availableDates: [],
        maxTravelers: "",
      });
      fetchData();
    } catch (error) {
      if (error.response?.status === 401) {
        delete axios.defaults.headers.common['Authorization'];
        navigate('/admin/login');
      }
      enqueueSnackbar(
        error.response?.data?.message || "Error creating package", 
        { variant: 'error' }
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Panel</h1>
      
      <MessageAlert 
        message={message} 
        onClose={() => setMessage("")} 
      />

      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="bg-white rounded-lg shadow">
        {activeTab === "packages" ? (
          <ManagePackages 
            packages={packages}
            fetchData={fetchData}
            setMessage={setMessage}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <ManageBookings 
            bookings={bookings}
            fetchData={fetchData}
            setMessage={setMessage}
          />
        )}
      </div>

      <CreatePackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPackage={newPackage}
        setNewPackage={setNewPackage}
        handleCreatePackage={handleCreatePackage}
      />
    </div>
  );
}

export default AdminPanel;
