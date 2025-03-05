import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Award, 
  Calendar 
} from 'lucide-react';

// GraphQL Query and Mutation
const GET_STAFF_BY_USERNAME = gql`
  query GetStaffByUsername($Username: String!) {
    GetStaffByUsername(Username: $Username) {
      firstName
      lastName
      email
      phone
      department
      role
      status
      joiningDate
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_STAFF_MUTATION = gql`
  mutation UpdateStaff(
    $Username: String!
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $department: String
    $role: String
    $status: String
  ) {
    UpdateStaff(
      Username: $Username
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      department: $department
      role: $role
      status: $status
    ) {
      firstName
      lastName
      email
      phone
      department
      role
      status
    }
  }
`;

export default function StaffDetails() {
  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);

  // Fetch Staff Details
  const { data, loading, error, refetch } = useQuery(GET_STAFF_BY_USERNAME, {
    variables: { Username: username },
    onCompleted: (data) => {
      setEditedStaff(data.GetStaffByUsername);
      console.log(username)
    },
  });

  // Update Staff Mutation
  const [updateStaff, { loading: updateLoading }] = useMutation(UPDATE_STAFF_MUTATION, {
    onCompleted: () => {
      setIsEditing(false);
      refetch(); // Refetch the latest data
    },
    onError: (error) => {
      console.error('Update Error:', error);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateStaff({
      variables: {
        Username: username,
        firstName: editedStaff.firstName,
        lastName: editedStaff.lastName,
        email: editedStaff.email,
        phone: editedStaff.phone,
        department: editedStaff.department,
        role: editedStaff.role,
        status: editedStaff.status
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-2 text-gray-600">Loading staff details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  const staff = editedStaff || data?.GetStaffByUsername;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-3xl flex items-center">
              <User className="mr-3 text-primary" />
              Staff Details
            </h2>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button 
                  className="btn btn-ghost btn-circle"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-circle"
                    onClick={handleSave}
                    disabled={updateLoading}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button 
                    className="btn btn-error btn-circle"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedStaff(data.GetStaffByUsername);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="form-control">
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editedStaff.firstName}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editedStaff.lastName}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${staff.firstName}+${staff.lastName}&background=random`} 
                    alt={`${staff.firstName} ${staff.lastName}`}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-2xl font-bold">{staff.firstName} {staff.lastName}</h3>
                  <p className="text-gray-500">{staff.role}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="form-control">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedStaff.email}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedStaff.phone}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">Department</label>
                    <select
                      name="department"
                      value={editedStaff.department}
                      onChange={handleInputChange}
                      className="select select-bordered"
                    >
                      <option>Computer Science</option>
                      <option>Mathematics</option>
                      <option>Physics</option>
                      <option>Biology</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">Status</label>
                    <select
                      name="status"
                      value={editedStaff.status}
                      onChange={handleInputChange}
                      className="select select-bordered"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="text-primary" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Phone className="text-primary" />
                    <span>{staff.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Building2 className="text-primary" />
                    <span>{staff.department}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Award className="text-primary" />
                    <span>{staff.status}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="text-primary" />
                    <span>Joined: {new Date(parseInt(staff.joiningDate)).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="text-primary" />
                    <span>Created: {new Date(parseInt(staff.createdAt)).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="text-primary" />
                    <span>Updated: {new Date(parseInt(staff.updatedAt)).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}