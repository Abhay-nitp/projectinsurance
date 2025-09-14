
// Login function
// document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
//     e.preventDefault();
    
//     const emailOrPhone = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//         const response = await fetch("http://localhost:5000/api/auth/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ emailOrPhone, password }),
//             credentials: "include"  // Ensures the token is stored as an HTTP-only cookie
//         });

//         const data = await response.json();
//         //const user = await response.json();
//             console.log("Auth response:", data); // ✅ Log API response

//         if (response.ok) {
//            // localStorage.setItem("token", data.token);  // ✅ Store JWT token
//             localStorage.setItem("userName", data.user.name);
//             localStorage.setItem("userEmail", data.user.email);
//             alert("Login successful! Redirecting...");
//             window.location.href = "index.html"; 
//         } else {
//             alert(data.message || "Invalid credentials!");
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
//         alert("Something went wrong. Please try again.");
//     }
// });
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const emailOrPhone = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrPhone, password }),
            credentials: "include",  // ✅ Important for cookies
        });

        console.log("Response Status:", response.status); // ✅ Log status
        const data = await response.json();
        localStorage.setItem("role", data.role);
        console.log("Auth Response Data:", data); // ✅ Log full API response

        if (response.ok) {
            localStorage.setItem("token", data.token);  
            
            alert("Login successful! Redirecting...");
            if (data.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html"; // Redirect non-admins to homepage
            } 
        } else {
            alert(data.message || "Invalid credentials!");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Please try again.");
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

// // Logout function
// function logout() {
//     fetch("http://localhost:5000/api/auth/logout", {
//         method: "POST",
//         credentials: "include", // Ensure cookies are cleared
//        //  res.clearCookie("jwt", { path: "/" });
       
//     })
//     .then(() => {
//         document.cookie = "jwt=; Max-Age=0"; 
//         localStorage.removeItem("token"); // Remove token from local storage
//         window.location.reload(); // Refresh page to update navbar
//         console.log("logged out");
//     })
//     .catch(err => console.error("Logout failed:", err));
// }
async function logout() {
    try {
        const response = await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include",  // ✅ Ensure cookies are sent
        });

        if (response.ok) {
            alert("Logged out successfully!");
            console.log("Logged out successfully!");
           
           // window.location.href = "index.html";
            location.reload(); // ✅ Refresh to reflect changes
        } else {
            console.error("Logout failed:", await response.text());
            alert("not Logged out successfully!");
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
}


    // document.getElementById("registerForm").addEventListener("submit", async function (e) {
    //     e.preventDefault();
        
    //     const name = document.getElementById("name").value;
    //     const email = document.getElementById("email").value;
    //     const phone = document.getElementById("phone").value;
    //     const password = document.getElementById("password").value;

    //     const response = await fetch("http://localhost:5000/api/auth/register", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name, email, phone, password })
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //         alert("Registration successful! Redirecting to login...");
    //         window.location.href = "index.html";  // Redirect to login
    //     } else {
    //         alert("Error: " + data.message);
    //     }
    // });


//update



// document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
//     e.preventDefault();
    
//     const emailOrPhone = document.getElementById("email").value;  // Fix: Corrected variable name
//     const password = document.getElementById("password").value;

//     try {
//         const response = await fetch("http://localhost:5000/api/auth/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ emailOrPhone, password })  // Fix: Corrected request payload
//         });

//         const data = await response.json();

//         if (response.ok) {  // Fix: Proper response checking
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("userName", data.user.name);  // Fix: Corrected key for name
//             localStorage.setItem("userEmail", data.user.emailOrPhone);
//             alert("Login successful! Redirecting...");
//             window.location.href = "dashboard.html"; 
//         } else {
//             alert("Invalid credentials!");
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
//         alert("Something went wrong. Please try again.");
//     }
// });

