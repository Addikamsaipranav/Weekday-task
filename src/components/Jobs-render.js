
import React, { useState, useEffect, useMemo } from "react";
import JobCard from "./JobCard";
import "../css/jobcard.css";
import "../css/filteration.css";
import { API_URL } from "../utils/data";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const initialOffset = 0;
let limit = 10;

const JobPortal = () => {
    const [jobListings, setJobListings] = useState([]);
    const [offset, setOffset] = useState(initialOffset);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        experience: "0",
        jobTypes: "",
        minSalary: "0",
        selectedRole: "",
        companySearch: ""
    });

    useEffect(() => {
        fetchData({ limit, offset });
    }, []);

    const fetchData = (params) => {
        console.log(params)
        const body = JSON.stringify(params);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        fetch(API_URL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.totalCount) {
                    setTotalCount(result.totalCount);
                }
                setOffset(prevOffset => prevOffset + result.jdList.length);
                setJobListings(prevListings => [...prevListings, ...result.jdList]);
            })
            .catch((error) => console.error(error));
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        setOffset(initialOffset);
        setJobListings([]);
        fetchData({ ...filters, [name]: value, offset: initialOffset });
    };

    const filteredJobs = useMemo(() => {
        return jobListings.filter(job => {
            if (parseInt(filters.experience) > 0) {
                return parseInt(job.minExp) <= parseInt(filters.experience);
            }
            return true;
        }).filter(job => {
            if (filters.jobTypes === "In-Office") {
                return job.location !== "hybrid" && job.location !== "remote";
            } else if (filters.jobTypes === "remote" || filters.jobTypes === "hybrid") {
                return job.location === filters.jobTypes;
            }
            return true;
        }).filter(job => {
            if (parseInt(filters.minSalary) > 0) {
                const minSalary = parseInt(filters.minSalary);
                const jobMinSalary = parseInt(job.minJdSalary);
                const jobMaxSalary = parseInt(job.maxJdSalary);
                return jobMinSalary >= minSalary || jobMaxSalary >= minSalary;
            }
            return true;
        }).filter(job => {
            if (filters.selectedRole) {
                return job.jobRole === filters.selectedRole;
            }
            return true;
        }).filter(job => {
            if (filters.companySearch) {
                return job.companyName.toLowerCase().includes(filters.companySearch.toLowerCase());
            }
            return true;
        });
    }, [jobListings, filters]);

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setOffset(prevOffset => prevOffset + jobListings.length);
            fetchData({ ...filters, offset });
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
                <select name="selectedRole" value={filters.selectedRole} onChange={handleFilterChange}>
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
                <select name="experience" value={filters.experience} onChange={handleFilterChange}>
                <option value="0">Experience</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} years</option>
                    ))}
                </select>
                <select name="jobTypes" value={filters.jobTypes} onChange={handleFilterChange}>
                <option value="0">Select Job Type</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="In-Office">In-Office</option>
                </select>
                <select name="minSalary" value={filters.minSalary} onChange={handleFilterChange}>
                <option value="0">Minimum Base Pay Salary</option>
                    {[...Array(11)].map((_, i) => (
                        <option key={i} value={i * 10}>${i * 10}</option>
                    ))}
                </select>
                <input
                    type="text"
                    name="companySearch"
                    value={filters.companySearch}
                    onChange={handleFilterChange}
                    placeholder="Search for Company"
                />
            </div>

            <div id="jobListings" className="job-listings">
                {filteredJobs.map((job, index) => (
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
            {jobListings.length === 0 && <div>No jobs found.</div>}
        </div>
    );
}

export default JobPortal;
