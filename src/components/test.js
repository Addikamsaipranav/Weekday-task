// const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// const body = JSON.stringify({
//     "limit": 1000,
//     "offset": 0 // Set offset as 1000
// });

// const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body
// };

// // Define a set to store unique job roles
// const uniqueJobRoles = new Set();

// fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//         result.jdList.forEach(job => {
//             // Add job roles to the set
//             uniqueJobRoles.add(job.jobRole);
//             // Print each job role
//             console.log("Job Role:", job.jobRole);
//         });

//         // Print the unique job roles
//         console.log("Unique Job Roles:");
//         uniqueJobRoles.forEach(role => {
//             console.log(role);
//         });
//     })
//     .catch((error) => console.error(error));
