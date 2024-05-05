import React, { useState, useEffect } from "react";
import JobCard from "./JobCard"; 
import "../css/jobcard.css";
import "../css/filteration.css";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const initialOffset = 0; 
let limit = 12; 

const JobPortal = () => {
    const [jobListings, setJobListings] = useState([]);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);
    const [minExp, setExperience] = useState("0");
    const [jobTypes, setJobTypes] = useState([]);

    useEffect(() => {
        fetchData({ limit, offset });
    }, []); 

    const fetchData = (params) => {
        console.log(jobListings)
        const body = JSON.stringify({
            "limit": 10,
             "offset": 0
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }
            
                setOffset(prevOffset => prevOffset + result.jdList.length);
                

                if (parseInt(params.minExp) > 0) {
                    limit = 20; 
                } else {
                    limit = 10; 
                }

                console.log(params)
                if (parseInt(params.minExp) > 0)  {
                    const filteredJobs = result.jdList.filter(job => {
                        return parseInt(job.minExp) <= parseInt(params.minExp);
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
        fetchData({ minExp: selectedExperience, limit, offset: initialOffset });
    };

    const handleJobTypeChange = (event) => {
        const selectedTypes = Array.from(event.target.selectedOptions, option => option.value);
        setJobTypes(selectedTypes);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ minExp, jobTypes: selectedTypes, limit, offset: initialOffset });
    };

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setOffset(prevOffset => prevOffset + jobListings.length); 
            fetchData({ minExp: parseInt(minExp), jobTypes, limit, offset });
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
                <select value={minExp} onChange={handleExperienceChange}>
                    <option value="0">Select Experience</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} years</option>
                    ))}
                </select>
                <select value={jobTypes} onChange={handleJobTypeChange}>
                <option value="0">Job-Type</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
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
