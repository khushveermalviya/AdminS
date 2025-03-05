import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { 
  Users, 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Award 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const STAFF_QUERY = gql`
  query GetAllStaff {
    GetAllStaff {
      Username
      firstName
      lastName
      department
      role
      email
      phone
      status
    }
  }
`;

export default function StaffManagement() {
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [fetchStaff] = useLazyQuery(STAFF_QUERY, {
    onCompleted: (data) => {
      const transformedData = data.GetAllStaff.map(staff => ({
        ...staff,
        username: staff.Username,
        name: `${staff.firstName} ${staff.lastName}`,
      }));
      setStaffData(transformedData);
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching staff data.');
      setLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter function for search
  const getFilteredData = () => {
    if (!searchQuery) return staffData;
    
    return staffData.filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-2 text-gray-600">Loading staff data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Users className="mr-3 text-primary" />
          Staff Management
        </h1>
        <NavLink 
          to="addstaff" 
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2" /> Add New Staff
        </NavLink>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search staff by name, email, or department"
          className="input input-bordered w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredData().map((staff) => (
          <div 
            key={staff.Username} 
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => navigate(`${staff.username}`)}
          >
            <div className="card-body">
              <div className="flex items-center space-x-4 mb-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${staff.firstName}+${staff.lastName}&background=random`} 
                      alt={staff.name} 
                    />
                  </div>
                </div>
                <div>
                  <h2 className="card-title">{staff.name}</h2>
                  <p className="text-gray-500">{staff.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="text-primary w-5 h-5" />
                  <span className="text-sm">{staff.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="text-primary w-5 h-5" />
                  <span className="text-sm">{staff.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="text-primary w-5 h-5" />
                  <span className="text-sm">{staff.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                <Award className="text-primary w-5 h-5" />
                  <span className={`text-sm font-medium ${staff.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {staff.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredData().length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No staff members found.</p>
        </div>
      )}
    </div>
  );
}