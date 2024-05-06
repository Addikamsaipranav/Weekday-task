import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import "../css/jobcard.css";
import "../css/filteration.css";
import {API_URL} from "../utils/data.js"
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
    const [minSalary, setMinSalary] = useState("0"); 
    const [selectedRole, setSelectedRole] = useState(""); 
    const [companySearch, setCompanySearch] = useState(""); 

    useEffect(() => {
        fetchData({ limit, offset });
    }, []);

    const fetchData = (params) => {
        //Body values as given in requiremnts sheet
        const body = JSON.stringify(params);

        // Setting up request options as per requirment sheet
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        // Fetching data from the API
        fetch(API_URL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // Updating total count
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }

                // updating offset
                setOffset(prevOffset => prevOffset + result.jdList.length);

                // filtering jobs based on parameters
                let filteredJobs = result.jdList.filter(job => {
                    // filtering based on experience
                    if (parseInt(params.experience) > 0) {
                        return parseInt(job.minExp) <= parseInt(params.experience)
                    }
                    return true; 
                }).filter(job => {
                    // filtering based on job types
                    if (params.jobTypes === "In-Office") {
                        return job.location !== "hybrid" && job.location !== "remote";
                    } else if (params.jobTypes === "remote" || params.jobTypes === "hybrid") {
                        return job.location === params.jobTypes;
                    }
                    return true; 
                }).filter(job => {
                    // filtering based on minimum base pay salary
                    if (parseInt(params.minSalary) > 0) {
                        const minSalary = parseInt(params.minSalary);
                        const jobMinSalary = parseInt(job.minJdSalary);
                        const jobMaxSalary = parseInt(job.maxJdSalary);
                
                        // check if the selected salary is within the range of min and max salary
                        return minSalary >= jobMinSalary && minSalary <= jobMaxSalary || minSalary <= jobMinSalary && minSalary >= jobMaxSalary;
                    }
                    return true;
                }).filter(job => {
                    // filtering based on selected role
                    if (params.selectedRole) {
                        return job.jobRole === params.selectedRole;
                    }
                    return true; 
                }).filter(job => {
                    // filtering based on company search
                    if (params.companySearch) {
                        return job.companyName.toLowerCase().includes(params.companySearch.toLowerCase());
                    }
                    return true; 
                });

                // updating job listings
                setJobListings(prevListings => [...prevListings, ...filteredJobs]);
            })
            .catch((error) => console.error(error));
    };


    //Function handlers for all filters 
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


    //Inifnite Scroll Logic
    //when ever user scrolls and comes to bottom it will call fetchData() with updated offset value 
    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setOffset(prevOffset => prevOffset + jobListings.length);
            fetchData({ experience: parseInt(experience), jobTypes, minSalary, limit, offset, selectedRole, companySearch });
        }
    };


    //After page renderes this useEFfect Hook invokes the infinite handle scroll fucntion
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [jobListings]);

    return (
        <div>
            {/* Drop down Options for Filters */}
            <div className="dropdown-container">
               
                <select value={selectedRole} onChange={handleRoleChange}>
                    <option value="">Select Role</option>
                    <optgroup label="ENGINEERING">
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="tech lead">Tech Lead</option>
                        <option value="android">Android</option>
                        <option value="ios">IOS</option>
                        <option value="dev-ops">Dev-Ops</option>
                        <option value="data engineer">Data Engineer</option>
                        <option value="computer vision">Computer vision</option>
                        <option value="nlp">Nlp</option>
                        <option value="deep learning">Deep-Leaning</option>
                        <option value="test/qa">Test/Qa</option>
                        <option value="web3">web3</option>
                        <option value="sre">Sre</option>
                        <option value="dat infrastructure">Data Infrastructure</option>
                        
                    </optgroup>
                    <optgroup label="DESIGN">
                        <option value="designer">Designer</option>
                        <option value="designmanager">Design Manager</option>
                        <option value="graphicdesigner">Graphic Designer</option>
                        <option value="productdesigner">Product Designer</option>
                    </optgroup>
                    <optgroup label="PRODUCT">
                        <option value="product manager">Product Manager </option>
                        
                    </optgroup>
                    <optgroup label="OPERATIONS">
                        <option value="operations manager">Operations Manager </option>
                        <option value="founders office/cheif of staff">Founder's Office / Cheif Staff </option>
                    </optgroup>
                    <optgroup label="Sales">
                        <option value="salesdevelopmentrepresentative">Sales Development Representative</option>
                        <option value="accountexecutive">Account Executive</option>
                        <option value="accountmanager">Account Manager</option>
                    </optgroup>
                    <optgroup label="Marketing">
                        <option value="digitalmarketing">Digital Marketing</option>
                        <option value="growthhacker">Growth Hacker</option>
                        <option value="marketing">Marketing</option>
                        <option value="productmarketingmanager">Product Marketing Manager</option>
                    </optgroup>
                    <optgroup label="Other Engineering">
                        <option value="hardware">Hardware</option>
                        <option value="mechanical">Mechanical</option>
                        <option value="systems">Systems</option>
                    </optgroup>
                    <optgroup label="Business Analyst">
                        <option value="businessanalyst">Business Analyst</option>
                    </optgroup>
                    
                                    
                </select>
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
                <select value={minSalary} onChange={handleMinSalaryChange}>
                    <option value="0">Minimum Base Pay Salary</option>
                    {[...Array(11)].map((_, i) => (
                        <option key={i} value={i * 10}>${i * 10}</option>
                    ))}
                </select>
                <input 
                    type="text" 
                    value={companySearch} 
                    onChange={handleCompanySearchChange} 
                    placeholder="Search for Company" 
                />
            </div>

            {/* job card is kept in a loop to render all in UI */}
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
           
            {jobListings.length === 0 && <div>No jobs found.</div>}
        </div>
    );
}

export default JobPortal;