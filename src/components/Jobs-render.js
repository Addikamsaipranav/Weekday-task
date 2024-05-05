import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import Filters from "./filters";
import "../css/jobcard.css";
import "../css/filteration.css";
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';


const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const initialOffset = 0;
let limit = 10;

const JobPortal = () => {
    const [jobListings, setJobListings] = useState([]);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);
    const [experience, setExperience] = useState("0");
    const [jobTypes, setJobTypes] = useState("");
    const [minSalary, setMinSalary] = useState("0"); // State for selected minimum base pay salary
    const [selectedRole, setSelectedRole] = useState(""); // State for selected role
    const [companySearch, setCompanySearch] = useState(""); // State for company search
    const [loading, setLoading] = useState(false); // State for loading indicator

    useEffect(() => {
        fetchData({ limit, offset });
    }, []);

    const fetchData = (params) => {
        
        setLoading(true); // Set loading state to true when fetching data
        // Constructing the body of the request
        const body = JSON.stringify(params);

        // Setting up request options
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        // Fetching data from the API
        fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // Updating total count
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }

                // Updating offset
                setOffset(prevOffset => prevOffset + result.jdList.length);

                // Filtering jobs based on parameters
                let filteredJobs = result.jdList.filter(job => {
                    // Filtering based on experience
                    if (parseInt(params.experience) > 0) {
                        return parseInt(job.minExp) <= parseInt(params.experience)
                    }
                    return true; // Return true for other cases
                }).filter(job => {
                    // Filtering based on job types
                    if (params.jobTypes === "In-Office") {
                        return job.location !== "hybrid" && job.location !== "remote";
                    } else if (params.jobTypes === "remote" || params.jobTypes === "hybrid") {
                        return job.location === params.jobTypes;
                    }
                    return true; // Return true for other cases
                }).filter(job => {
                    // Filtering based on minimum base pay salary
                    if (parseInt(params.minSalary) > 0) {
                        const minSalary = parseInt(params.minSalary);
                        const jobMinSalary = parseInt(job.minJdSalary);
                        const jobMaxSalary = parseInt(job.maxJdSalary);
                
                        // Check if the selected salary is within the range of min and max salary
                        return minSalary >= jobMinSalary && minSalary <= jobMaxSalary || minSalary <= jobMinSalary && minSalary >= jobMaxSalary;
                    }
                    return true; // Return true for other cases
                }).filter(job => {
                    // Filtering based on selected role
                    if (params.selectedRole) {
                        return job.jobRole === params.selectedRole;
                    }
                    return true; // Return true for other cases
                }).filter(job => {
                    // Filtering based on company search
                    if (params.companySearch) {
                        return job.companyName.toLowerCase().includes(params.companySearch.toLowerCase());
                    }
                    return true; // Return true for other cases
                });

                // Updating job listings
                setJobListings(prevListings => [...prevListings, ...filteredJobs]);
                setLoading(false); // Set loading state to false after data is fetched
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Set loading state to false if there's an error
            });
    };

    const handleExperienceChange = (event) => {
        const selectedExperience = event.target.value;
        setExperience(selectedExperience);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience: selectedExperience, jobTypes, minSalary, limit, offset: initialOffset, selectedRole, companySearch });
    };

    const handleJobTypeChange = (event) => {
        const selectedType = event.target.value;
        setJobTypes(selectedType);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience, jobTypes: selectedType, minSalary, limit, offset: initialOffset, selectedRole, companySearch });
    };

    const handleMinSalaryChange = (event) => {
        const selectedMinSalary = event.target.value;
        setMinSalary(selectedMinSalary);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience, jobTypes, minSalary: selectedMinSalary, limit, offset: initialOffset, selectedRole, companySearch });
    };

    const handleRoleChange = (event) => {
        const selectedRole = event.target.value;
        setSelectedRole(selectedRole);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience, jobTypes, minSalary, limit, offset: initialOffset, selectedRole, companySearch });
    };

    const handleCompanySearchChange = (event) => {
        const searchValue = event.target.value;
        setCompanySearch(searchValue);
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ experience, jobTypes, minSalary, limit, offset: initialOffset, selectedRole, companySearch: searchValue });
    };

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setOffset(prevOffset => prevOffset + jobListings.length);
            fetchData({ experience: parseInt(experience), jobTypes, minSalary, limit, offset, selectedRole, companySearch });
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
            <Filters
                selectedRole={selectedRole}
                experience={experience}
                jobTypes={jobTypes}
                minSalary={minSalary}
                companySearch={companySearch}
                handleRoleChange={handleRoleChange}
                handleExperienceChange={handleExperienceChange}
                handleJobTypeChange={handleJobTypeChange}
                handleMinSalaryChange={handleMinSalaryChange}
                handleCompanySearchChange={handleCompanySearchChange}
            />

            {loading ? (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
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
                        />
                    ))}
                </div>
            )}

            {jobListings.length === 0 && !loading && <div className="error-text">No jobs found.</div>}
        </div>
    );
}

export default JobPortal;
