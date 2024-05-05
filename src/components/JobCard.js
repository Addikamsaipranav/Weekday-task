import React, { useState } from 'react';
import '../css/jobcard.css'; // Import CSS file for styling

const JobCard = ({ companyName, companyPhoto, jobTitle, location, estimatedSalary, aboutCompany, minExperience, easyApply, askForReferral }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Function to calculate the percentage of characters to display in the aboutCompany section
    const calculateDivContent = () => {
        const totalCharacters = aboutCompany.length;
        const fiftyPercent = Math.floor((totalCharacters * 40) / 100); // 50% of total characters
        const sixtyPercent = Math.floor((totalCharacters * 55) / 100); // 60% of total characters
        const seventyPercent = Math.floor((totalCharacters *65) / 100); // 70% of total characters

        const firstPart = aboutCompany.substring(0, fiftyPercent);
        const secondPart = aboutCompany.substring(fiftyPercent, sixtyPercent);
        const thirdPart = aboutCompany.substring(sixtyPercent, seventyPercent);

        return {
            firstPart,
            secondPart,
            thirdPart
        };
    };

    return (
        <div className="job-card">
            <div className="top-row">
                <img src={companyPhoto} alt="Company Logo" className="company-photo" />
                <div className="company-details">
                    <div className="company-name">{capitalizeFirstLetter(companyName)}</div>
                    <div className="job-title">{capitalizeFirstLetter(jobTitle)}</div>
                    <div className="location">{capitalizeFirstLetter(location)}</div> 
                </div>
            </div>

            <div className="estimated-salary">Estimated Salary: {estimatedSalary} ✅</div>
            <div className="about-company-heading">
                <span className='bold-text'>About Company</span>
                <div><span className='bold-text1'>About Us</span></div>
                <div className="blurry-text1">{calculateDivContent().firstPart}</div>
                <div className="blurry-text2">{calculateDivContent().secondPart}</div>
                <div className="blurry-text3">{calculateDivContent().thirdPart}</div>

            </div>
            <div className='view-job'>View Job</div>
            <div className='minimum-experience'>Minimum Experience</div>
            <div className='minimum-experience1'>{minExperience}</div>
            <button class="custom-button">⚡Easy Apply</button>
        </div>
    );
};

export default JobCard;
