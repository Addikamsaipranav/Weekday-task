import React, { useState, useEffect } from "react";
import JobCard from "./JobCard"; // Import the JobCard component
import "../css/jobcard.css";
import "../css/filteration.css"

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const initialOffset = 0; // Initial offset
let limit = 12; // Initial number of items per page

const JobPortal = () => {
    const [jobListings, setJobListings] = useState([]);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);
    const [experience, setExperience] = useState("0"); // State for selected experience

    useEffect(() => {
        fetchData({ limit, offset }); // Fetch data when component mounts
    }, []); 

    const fetchData = (params) => {
        
        const body = JSON.stringify(params);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("Fetched job listings for experience:", params.experience, result.jdList);
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }
            
                setOffset(prevOffset => prevOffset + result.jdList.length);
                
                if (parseInt(params.experience) > 0) {
                    limit = 72; // Change limit when experience is set
                } else {
                    limit = 12; // Change limit when experience is null
                }
                
                if (parseInt(params.experience) > 0) {
                    const filteredJobs = result.jdList.filter(job => {
                        return parseInt(job.minExp) <= parseInt(params.experience) && parseInt(params.experience) <= parseInt(job.maxExp);
                    });
                    setJobListings(prevListings => [...prevListings, ...filteredJobs]);
                   
                } else {
                    setJobListings(prevListings => [...prevListings, ...result.jdList]);
                   
                }
            })
            .catch((error) => console.error(error));
    };

    const handleExperienceChange = (event) => {
        const selectedExperience = event.target.value;
        setExperience(selectedExperience);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience: selectedExperience, limit, offset: initialOffset });
    };

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            console.log("Previous Offset:", offset);
            setOffset(prevOffset => prevOffset + jobListings.length); // Update offset
            
            console.log("Updated Offset:", offset);
            fetchData({ experience: parseInt(experience), limit, offset }); // Fetch more data with updated offset
        }
    };
    

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [jobListings]);

    return (
        <div>
            <div className="dropdown-container">
                <select value={experience} onChange={handleExperienceChange}>
                    <option value="0">Experience</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} years</option>
                    ))}
                </select>
            </div>

            <div id="jobListings" className="job-listings">
                {jobListings.map((job, index) => (
                    <JobCard
                        key={index}
                        companyName={job.companyName}
                        companyPhoto={job.logoUrl}
                        jobTitle={job.jobRole}
                        location={job.location}
                        estimatedSalary={`$${job.minJdSalary} - $${job.maxJdSalary} ${job.salaryCurrencyCode}`}
                        aboutCompany={job.jobDetailsFromCompany}
                        minExperience={`${job.minExp} years`}
                        easyApply={true}
                        askForReferral={true}
                    />
                ))}
            </div>
            {jobListings.length < totalCount && <div>Loading...</div>}
        </div>
    );
}

export default JobPortal;
