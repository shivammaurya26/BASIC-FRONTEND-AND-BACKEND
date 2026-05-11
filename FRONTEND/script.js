document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.getElementById('complaintForm');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const responseMessage = document.getElementById('responseMessage');

    const API_URL = 'http://localhost:3000/api/complaints';

    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State: Loading
        submitBtn.disabled = true;
        loader.style.display = 'block';
        responseMessage.className = 'response-message';
        responseMessage.textContent = '';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            city: document.getElementById('city').value,
            mobile: document.getElementById('mobile').value,
            complaint: document.getElementById('complaint').value
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Success
                responseMessage.textContent = 'Complaint submitted successfully! We will get back to you soon.';
                responseMessage.classList.add('success');
            } else {
                // Error from server
                throw new Error(result.error || 'Failed to submit complaint');
            }
        } catch (error) {
            // Network or other error
            console.error('Submission error:', error);
            responseMessage.textContent = error.message || 'Something went wrong. Please try again later.';
            responseMessage.classList.add('error');
        } finally {
            // UI State: Idle
            submitBtn.disabled = false;
            loader.style.display = 'none';
        }
    });
});
