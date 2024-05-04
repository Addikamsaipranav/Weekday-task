import React, { useState, useEffect } from "react";
import JobCard from "./JobCard"; // Import the JobCard component
import "../css/jobcard.css";
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const initialOffset = 0; // Initial offset
const limit = 12; // Number of items per page

const JobPortal = () => {
    const [jobListings, setJobListings] = useState([]);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []); // Fetch data when component mounts

    const fetchData = () => {
        const body = JSON.stringify({
            "limit": limit,
            "offset": offset
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
            .then((response) => response.json())
            .then((result) => {
            
                // Update totalCount if available
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }

                // Update offset for the next request
                setOffset(prevOffset => prevOffset + result.jdList.length);

                // Append new job listings to the existing list
                setJobListings(prevListings => [...prevListings, ...result.jdList]);
            })
            .catch((error) => console.error(error));
    };

    // Function to handle scroll event
    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            window.removeEventListener('scroll', handleScroll); // Remove scroll event listener to prevent multiple calls
            fetchData(); // Fetch more data
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll); // Add scroll event listener
        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup scroll event listener
        };
    }, [jobListings]); // Reattach scroll event listener when jobListings change

    return (
        <div>
            
            <div id="jobListings" className="job-listings">
                {/* Map through jobListings and render JobCard component for each job */}
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
                        easyApply={true} // You can customize this based on your logic
                        askForReferral={true} // You can customize this based on your logic
                    />
                ))}
            </div>
            {jobListings.length < totalCount }
        </div>
    );
}

export default JobPortal;
