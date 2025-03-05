import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { PlusCircle, Edit2, User, Search } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

// GraphQL query remains the same
const GET_STUDENT = gql`
  query GetStudentData($Class: String!) {
    Studentdata(Class: $Class) {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

const StudentManagement = () => {
  const [selectedClass, setSelectedClass] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [fetchStudentData, { data }] = useLazyQuery(GET_STUDENT, {
    variables: { Class: selectedClass },
    onCompleted: (data) => {
      setError(null);
      if (data.Studentdata && Array.isArray(data.Studentdata)) {
        if (data.Studentdata.length > 0) {
          setStudents(data.Studentdata);
          setFilteredStudents(data.Studentdata);
        } else {
          setStudents([]);
          setFilteredStudents([]);
        }
      } else {
        setError('No student data available for the selected class.');
      }
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching student data.');
      setLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    setLoading(true);
    fetchStudentData();
  }, [selectedClass, fetchStudentData]);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student => 
        `${student.FirstName} ${student.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.StudentID.toString().includes(searchTerm)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleEditClick = (studentId) => {
    navigate(`${studentId}`);
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSearchTerm(''); // Reset search when changing class
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">Students</h1>
        <NavLink
          to="Addstudent"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          Add Student
        </NavLink>
      </div>

      {/* Class and Search Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Class Dropdown */}
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={`${i + 1}`}>{`${i + 1}${getOrdinal(i + 1)} Grade`}</option>
          ))}
        </select>

        {/* Search Bar */}
        <div className="relative w-full sm:flex-grow">
          <input
            type="text"
            placeholder="Search students by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center">
            <span className="loading loading-spinner text-blue-500"></span>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            {searchTerm 
              ? `No students found matching "${searchTerm}"` 
              : "No students available in this class."
            }
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div 
              key={student.StudentID} 
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {`${student.FirstName} ${student.LastName}`}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {student.StudentID}</p>
                </div>
              </div>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  Grade: {student.Class}
                </span>
                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded"
                  onClick={() => handleEditClick(student.StudentID)}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to get ordinal suffix
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v-20)%10] || s[v] || s[0]);
}

export default StudentManagement;