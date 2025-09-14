document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include", // Send cookies with request
        });

        if (response.ok) {
            const user = await response.json();
            console.log("Auth response:", user); // ✅ Log API response
            // Hide login/signup, show account/logout
        //    window.location.href = ".html";
        } else {
            // Show login/signup if user is NOT authenticated
            window.location.href = "register.html";
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
});
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include", // Send cookies with request
        });

        if (response.ok) {
            const user = await response.json();
            console.log("Auth response:", user); // ✅ Log API response
            // Hide login/signup, show account/logout
            document.getElementById("signup").style.display = "none";
            document.getElementById("login").style.display = "none";
            document.getElementById("account").style.display = "inline";
            document.getElementById("logout").style.display = "inline";
        } else {
            // Show login/signup if user is NOT authenticated
            document.getElementById("signup").style.display = "inline";
            document.getElementById("login").style.display = "inline";
            document.getElementById("account").style.display = "none";
            document.getElementById("logout").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const dropdown = document.getElementById("policy_id");
    const token = localStorage.getItem("token"); // Retrieve JWT token

    if (!token) {
        alert("Unauthorized! Please log in.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/insurance", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch insurance policies");
        }

        const insurances = await response.json();
        
        // Populate the dropdown
        dropdown.innerHTML = `<option value="">Select Insurance</option>`;
        insurances.forEach(insurance => {
            const option = document.createElement("option");
            option.value = insurance._id;
            option.textContent = `Policy ID: ${insurance._id}`;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching insurance:", error);
    }
});


document.getElementById('claimForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const policy_id = document.getElementById('policy_id').value;
    // Validate the ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(policy_id)) {
        alert('Invalid Policy ID format');
        return;
    }
    const claim_reason = document.getElementById('claim_reason').value;
    const claim_amount = document.getElementById('claim_amount').value;
    const claim_status = document.getElementById('claim_status').value;
    const documents = document.getElementById('documents').value;

    const claimData = {
        policy_id,
        claim_reason,
        claim_amount,
        claim_status,
        documents
    };

    // Send the data to the backend (Node.js/Express API endpoint)
    fetch("http://localhost:5000/api/claim", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // If using JWT for authentication
        },
        body: JSON.stringify(claimData)
    })
    .then(response => response.json())
    .then(data => {
    //     if (data.message === "Claim submitted successfully") {
    //       console.log('Claim data saved to backend:', data);
    //       const messageDiv = document.getElementById('message');
    //     messageDiv.textContent = 'Claim submitted successfully!';
    //     messageDiv.style.color = 'green';  // Set success color
    //     messageDiv.style.fontWeight = 'bold';  // Make message stand out
    //   } else {
    //       console.error('Error submitting Claim:', data.message);
    //       const messageDiv = document.getElementById('message');
    //     messageDiv.textContent = 'Claim no submitted successfully!';
    //     messageDiv.style.color = 'green';  // Set success color
    //     messageDiv.style.fontWeight = 'bold';  // Make message stand out
    //   }
        console.log('Claim submitted:', data);

        //Display success message (could be styled as a notification)
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Claim submitted successfully!';
        messageDiv.style.color = 'green';  // Set success color
        messageDiv.style.fontWeight = 'bold';  // Make message stand out
    })
    .catch(error => {
        console.error('Error submitting claim:', error);

        // Display error message
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Failed to submit claim. Please try again.';
        messageDiv.style.color = 'red';  // Set error color
        messageDiv.style.fontWeight = 'bold';  // Make message stand out
    });
});
