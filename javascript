// Email Configuration
const emailConfig = {
    serviceID: "service_weguideabroad",  // You'll get this from EmailJS
    templateID: "template_weguideabroad", // You'll get this from EmailJS
    publicKey: "your_public_key_here"    // You'll get this from EmailJS
};

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Initialize with your public key
    }
})();

// Enhanced Form Data Collection
const formSubmissions = {
    quickApplications: [],
    visaBookings: [],
    consultations: [],
    volunteerApplications: [],
    aiRecommendations: [],
    documentUploads: []
};

// Function to send individual form submissions via EmailJS
async function sendFormSubmission(submission) {
    try {
        console.log('Sending email for:', submission.type);
        
        const templateParams = {
            to_email: "weguideabroad@gmail.com",
            from_name: "WeGuideAbroad Website Form",
            subject: `New ${submission.type} - ${submission.data.name || 'Unknown User'}`,
            submission_type: submission.type,
            student_name: submission.data.name || 'Not provided',
            student_email: submission.data.email || 'Not provided',
            student_phone: submission.data.phone || 'Not provided',
            submission_details: JSON.stringify(submission.data, null, 2),
            timestamp: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'medium'
            }),
            total_submissions: Object.values(formSubmissions).flat().length
        };

        // Send email using EmailJS
        const response = await emailjs.send(
            emailConfig.serviceID,
            emailConfig.templateID,
            templateParams
        );

        console.log('Email sent successfully:', response.status, response.text);
        return true;
        
    } catch (error) {
        console.error('Email failed to send:', error);
        
        // Fallback: Store in localStorage for later retrieval
        storeSubmissionLocally(submission);
        return false;
    }
}

// Fallback: Store submissions in localStorage
function storeSubmissionLocally(submission) {
    try {
        const stored = localStorage.getItem('pendingSubmissions') || '[]';
        const pending = JSON.parse(stored);
        pending.push({
            ...submission,
            storedAt: new Date().toISOString()
        });
        localStorage.setItem('pendingSubmissions', JSON.stringify(pending));
        console.log('Submission stored locally');
    } catch (e) {
        console.error('Failed to store locally:', e);
    }
}

// Function to send all submissions (for admin button)
async function sendAllSubmissionsToEmail() {
    try {
        const adminBtn = document.querySelector('[onclick*="viewSubmissions"]');
        const originalText = adminBtn.textContent;
        adminBtn.innerHTML = '<div class="loading"></div> Sending...';
        adminBtn.disabled = true;

        const totalSubmissions = Object.values(formSubmissions).flat().length;
        
        if (totalSubmissions === 0) {
            alert('No submissions to send!');
            adminBtn.textContent = originalText;
            adminBtn.disabled = false;
            return;
        }

        const templateParams = {
            to_email: "weguideabroad@gmail.com",
            from_name: "WeGuideAbroad Website",
            subject: `Complete Submissions Report - ${new Date().toLocaleDateString()}`,
            total_submissions: totalSubmissions,
            submissions_summary: `
Quick Applications: ${formSubmissions.quickApplications.length}
Visa Bookings: ${formSubmissions.visaBookings.length}
Consultations: ${formSubmissions.consultations.length}
Volunteer Applications: ${formSubmissions.volunteerApplications.length}
AI Recommendations: ${formSubmissions.aiRecommendations.length}
            `.trim(),
            all_submissions: JSON.stringify(formSubmissions, null, 2),
            timestamp: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'medium'
            })
        };

        const response = await emailjs.send(
            emailConfig.serviceID,
            emailConfig.templateID,
            templateParams
        );

        adminBtn.innerHTML = '✓ Email Sent!';
        adminBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            adminBtn.textContent = originalText;
            adminBtn.style.background = '';
            adminBtn.disabled = false;
        }, 3000);

        console.log('All submissions emailed successfully');
        return true;
        
    } catch (error) {
        console.error('Failed to send all submissions:', error);
        downloadSubmissionsAsJSON(formSubmissions);
        return false;
    }
}

// Download submissions as JSON file (fallback)
function downloadSubmissionsAsJSON(submissions) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify(submissions, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `weguideabroad-submissions-${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    alert('Email failed! Submissions downloaded as JSON file instead.');
}

// Enhanced viewSubmissions function
function viewSubmissions() {
    const totalSubmissions = Object.values(formSubmissions).flat().length;
    const summary = `
📊 Submission Summary:
• Quick Applications: ${formSubmissions.quickApplications.length}
• Visa Bookings: ${formSubmissions.visaBookings.length}
• Consultations: ${formSubmissions.consultations.length}
• Volunteer Applications: ${formSubmissions.volunteerApplications.length}
• AI Recommendations: ${formSubmissions.aiRecommendations.length}
• Total: ${totalSubmissions} submissions
    `.trim();
    
    if (totalSubmissions > 0) {
        const shouldEmail = confirm(`${summary}\n\nDo you want to email these submissions to weguideabroad@gmail.com?`);
        if (shouldEmail) {
            sendAllSubmissionsToEmail();
        } else {
            downloadSubmissionsAsJSON(formSubmissions);
        }
    } else {
        alert('No submissions found yet!');
    }
}

// Enhanced form submission functions with email notifications
async function submitQuickApp() {
    const name = document.getElementById('qaName').value.trim();
    const email = document.getElementById('qaEmail').value.trim();
    const phone = document.getElementById('qaPhone').value.trim();
    const country = document.getElementById('qaCountry').value;
    const course = document.getElementById('qaCourse').value;
    const message = document.getElementById('qaMessage').value.trim();

    // Validation
    if (!name || !email || !phone || !country || !course) {
        alert('Please fill in all required fields!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#quickAppModal .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
    submitBtn.disabled = true;

    // Store submission
    const submission = {
        timestamp: new Date().toISOString(),
        type: 'Quick Application',
        data: { name, email, phone, country, course, message }
    };
    
    formSubmissions.quickApplications.push(submission);

    // Send email notification
    const emailSent = await sendFormSubmission(submission);

    if (emailSent) {
        submitBtn.innerHTML = '✓ Submitted!';
        setTimeout(() => {
            alert(`Thank you ${name}! Your application has been submitted. We'll contact you soon at ${email}.`);
            closeQuickApplication();
            
            // Reset form
            document.getElementById('qaName').value = '';
            document.getElementById('qaEmail').value = '';
            document.getElementById('qaPhone').value = '';
            document.getElementById('qaCountry').value = '';
            document.getElementById('qaCourse').value = '';
            document.getElementById('qaMessage').value = '';
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    } else {
        alert(`Thank you ${name}! Your application has been submitted (offline mode). We'll contact you soon.`);
        closeQuickApplication();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Enhanced US Visa submission
async function submitUSVisa() {
    const name = document.getElementById('uvName').value.trim();
    const email = document.getElementById('uvEmail').value.trim();
    const phone = document.getElementById('uvPhone').value.trim();
    const type = document.getElementById('uvType').value;
    const date = document.getElementById('uvDate').value;
    const message = document.getElementById('uvMessage').value.trim();

    if (!name || !email || !phone || !type) {
        alert('Please fill in all required fields!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    const submitBtn = document.querySelector('#usVisaModal .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading"></div> Booking...';
    submitBtn.disabled = true;

    const submission = {
        timestamp: new Date().toISOString(),
        type: 'US Visa Booking',
        data: { name, email, phone, type, date, message }
    };
    
    formSubmissions.visaBookings.push(submission);

    const emailSent = await sendFormSubmission(submission);

    if (emailSent) {
        submitBtn.innerHTML = '✓ Booked!';
        setTimeout(() => {
            alert(`Thank you ${name}! Your US Visa slot booking request has been submitted. Our team will contact you within 24 hours.`);
            closeUSVisaForm();
            
            document.getElementById('uvName').value = '';
            document.getElementById('uvEmail').value = '';
            document.getElementById('uvPhone').value = '';
            document.getElementById('uvType').value = '';
            document.getElementById('uvDate').value = '';
            document.getElementById('uvMessage').value = '';
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    } else {
        alert(`Thank you ${name}! Your booking has been submitted (offline mode). We'll contact you soon.`);
        closeUSVisaForm();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Enhanced Consultation submission
async function submitConsultation() {
    const name = document.getElementById('cbName').value.trim();
    const email = document.getElementById('cbEmail').value.trim();
    const phone = document.getElementById('cbPhone').value.trim();
    const country = document.getElementById('cbCountry').value;
    const time = document.getElementById('cbTime').value;
    const message = document.getElementById('cbMessage').value.trim();

    if (!name || !email || !phone || !country) {
        alert('Please fill in all required fields!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    const submitBtn = document.querySelector('#bookingModal .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading"></div> Booking...';
    submitBtn.disabled = true;

    const submission = {
        timestamp: new Date().toISOString(),
        type: 'Consultation Booking',
        data: { name, email, phone, country, time, message }
    };
    
    formSubmissions.consultations.push(submission);

    const emailSent = await sendFormSubmission(submission);

    if (emailSent) {
        submitBtn.innerHTML = '✓ Booked!';
        setTimeout(() => {
            alert(`Thank you ${name}! Your free consultation has been booked. We'll reach out to you shortly to confirm the time.`);
            closeBookingForm();
            
            document.getElementById('cbName').value = '';
            document.getElementById('cbEmail').value = '';
            document.getElementById('cbPhone').value = '';
            document.getElementById('cbCountry').value = '';
            document.getElementById('cbTime').value = '';
            document.getElementById('cbMessage').value = '';
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    } else {
        alert(`Thank you ${name}! Your consultation has been booked (offline mode). We'll contact you soon.`);
        closeBookingForm();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Enhanced Volunteer submission
async function submitVolunteer() {
    const name = document.getElementById('vName').value.trim();
    const email = document.getElementById('vEmail').value.trim();
    const phone = document.getElementById('vPhone').value.trim();
    const country = document.getElementById('vCountry').value.trim();
    const city = document.getElementById('vCity').value.trim();
    const university = document.getElementById('vUniversity').value.trim();
    const course = document.getElementById('vCourse').value.trim();
    const year = document.getElementById('vYear').value;
    const years = document.getElementById('vYears').value;
    const payment = document.getElementById('vPayment').value;
    const languages = document.getElementById('vLanguages').value.trim();
    const comments = document.getElementById('vComments').value.trim();

    if (!name || !email || !phone || !country || !city) {
        alert('Please fill in all required fields!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    const submitBtn = document.querySelector('#volunteerModal .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
    submitBtn.disabled = true;

    const submission = {
        timestamp: new Date().toISOString(),
        type: 'Volunteer Application',
        data: { 
            name, email, phone, country, city, university, 
            course, year, years, payment, languages, comments 
        }
    };
    
    formSubmissions.volunteerApplications.push(submission);

    const emailSent = await sendFormSubmission(submission);

    if (emailSent) {
        submitBtn.innerHTML = '✓ Submitted!';
        setTimeout(() => {
            alert(`Thank you ${name}! Your volunteer application has been submitted. We appreciate your interest in helping students achieve their dreams!`);
            closeVolunteerForm();
            
            document.getElementById('vName').value = '';
            document.getElementById('vEmail').value = '';
            document.getElementById('vPhone').value = '';
            document.getElementById('vCountry').value = '';
            document.getElementById('vCity').value = '';
            document.getElementById('vUniversity').value = '';
            document.getElementById('vCourse').value = '';
            document.getElementById('vYear').value = '';
            document.getElementById('vYears').value = '';
            document.getElementById('vPayment').value = '';
            document.getElementById('vLanguages').value = '';
            document.getElementById('vComments').value = '';
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    } else {
        alert(`Thank you ${name}! Your volunteer application has been submitted (offline mode). We appreciate your interest!`);
        closeVolunteerForm();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Retry sending pending submissions
function retryPendingSubmissions() {
    try {
        const stored = localStorage.getItem('pendingSubmissions');
        if (stored) {
            const pending = JSON.parse(stored);
            if (pending.length > 0) {
                if (confirm(`You have ${pending.length} pending submissions. Try to send them now?`)) {
                    pending.forEach(async (submission, index) => {
                        setTimeout(async () => {
                            const success = await sendFormSubmission(submission);
                            if (success) {
                                // Remove from pending if sent successfully
                                const updatedPending = pending.filter((_, i) => i !== index);
                                localStorage.setItem('pendingSubmissions', JSON.stringify(updatedPending));
                            }
                        }, index * 1000); // Stagger requests
                    });
                }
            }
        }
    } catch (e) {
        console.error('Error retrying submissions:', e);
    }
}

// Check for pending submissions on page load
window.addEventListener('load', function() {
    setTimeout(retryPendingSubmissions, 3000);
});
