// import React, { useState } from 'react';
// import '../css/filteration.css'; // Import CSS file for styling

// const Filteration = () => {
//   // State variables to hold the selected values for each dropdown
//   const [role, setRole] = useState('');
//   const [numEmployees, setNumEmployees] = useState('');
//   const [experience, setExperience] = useState('');
//   const [workLocation, setWorkLocation] = useState('');
//   const [minSalary, setMinSalary] = useState('');
//   const [searchCompany, setSearchCompany] = useState('');

//   return (
//     <div className="filteration-container">
//       {/* Dropdown for Roles */}
//       <select value={role} onChange={(e) => setRole(e.target.value)} className="dropdown">
//         <option value="">Select Role</option>
//         <option value="engineering">Engineering</option>
//         <option value="software">Software</option>
//         <option value="frontend">Frontend</option>
//         <option value="backend">Backend</option>
//         <option value="datascience">Data Science</option>
//         <option value="ml">Machine Learning</option>
//         <option value="ai">Artificial Intelligence</option>

//       </select>
      
//       {/* Dropdown for Number of Employees */}
//       <select value={numEmployees} onChange={(e) => setNumEmployees(e.target.value)} className="dropdown">
//         <option value="">Number of Employees</option>
//         <option value="1-10">1-10</option>
//         <option value="11-50">11-50</option>
//         <option value="51-100">51-100</option>
//         <option value="101-500">101-500</option>
//         <option value="501-1000">501-1000</option>
//         <option value="1001+">1001+</option>
//       </select>
//       {/* Dropdown for Experience */}
//       <select value={experience} onChange={(e) => setExperience(e.target.value)} className="dropdown">
//         <option value="">Experience</option>
//         <option value="1-2">1-2 years</option>
//         <option value="3-5">3-5 years</option>
//         <option value="6-8">6-8 years</option>
//         <option value="9-10">9-10 years</option>
//       </select>
//       {/* Dropdown for Work Location */}
//       <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className="dropdown"> 
//         <option value="">Work Location  <span className="dropdown-separator">|</span></option>
//         <option value="remote">Remote</option>
//         <option value="hybrid">Hybrid</option>
//         <option value="in-office">In-Office</option>
//       </select>
//       {/* Dropdown for Minimum Base Pay Salary */}
//       <select value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className="dropdown">
//         <option value="">Min Base Pay Salary (LPA)</option>
//         {[...Array(71).keys()].map((num) => (
//           <option key={num} value={num}>{num} LPA</option>
//         ))}
//       </select>
//       {/* Input field for Searching by Company */}
//       <input
//         type="text"
//         value={searchCompany}
//         onChange={(e) => setSearchCompany(e.target.value)}
//         placeholder="Search by Company"
//         className="search-input"
//       />
//     </div>
//   );
// };

// export default Filteration;
