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
    const [experience, setExperience] = useState("0");
    const [jobTypes, setJobTypes] = useState(""); // State for selected job types

    useEffect(() => {
        fetchData({ limit, offset });
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
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }
            
                setOffset(prevOffset => prevOffset + result.jdList.length);
                
                if (parseInt(params.experience) > 0) {
                    limit = 72; 
                } else {
                    limit = 12; 
                }
                let count = 0;
                let filteredJobs = [];

                for (let key in params) {
                    const value = params[key];
                    
                    if (filteredJobs.length !== 0) {
                        jdList = filteredJobs; // Set jdList to filteredJobs if it's not empty
                    } else {
                        jdList = result.jdList; // Otherwise, set it to result.jdList
                    }

                    if (key === "experience" && parseInt(value) > 0) {
                        
                        filteredJobs = jdList.filter(job => parseInt(job.minExp) <= parseInt(value));
                        count += filteredJobs.length;
                    }

                    if (key == "jobTypes" && value !== "" && value !== '0') {
                        filteredJobs = [];
                        jdList.forEach(job => {
                            if (value == 'In-Office') {
                        if (job.location !== "hybrid" && job.location !== "remote") {
                            filteredJobs.push(job);
                        }
                        }
                            if(value=="hybrid" || value=="remote"){
                               
                                if (job.location === value) {
                                    filteredJobs.push(job);
                                }
                            }
                        });
                        count ++;
                    }

                }

                if (count === 0) {
                    setJobListings(prevListings => [...prevListings, ...result.jdList]);
                } else {
                    setJobListings(prevListings => [...prevListings, ...filteredJobs]);
                }

                // if (parseInt(params.experience) > 0) {
                //     const filteredJobs = result.jdList.filter(job => {
                //         return parseInt(job.minExp) <= parseInt(params.experience) ;
                //     });
                //     setJobListings(prevListings => [...prevListings, ...filteredJobs]);
                // }
                // else {
                //     setJobListings(prevListings => [...prevListings, ...result.jdList]);
                // }
            })
            .catch((error) => console.error(error));
    };

    const handleExperienceChange = (event) => {
        const selectedExperience = event.target.value;
        setExperience(selectedExperience);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience: selectedExperience, jobTypes, limit, offset: initialOffset });
    };

    const handleJobTypeChange = (event) => {
        const selectedType = event.target.value;
        setJobTypes(selectedType);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience, jobTypes: selectedType, limit, offset: initialOffset });
    };

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setOffset(prevOffset => prevOffset + jobListings.length); 
            fetchData({ experience: parseInt(experience), jobTypes, limit, offset });
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
                <select value={jobTypes} onChange={handleJobTypeChange}>
                    <option value="0">Select Job Type</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="In-Office">In-Office</option>
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
