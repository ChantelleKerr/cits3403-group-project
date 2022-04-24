window.onload = function () {
  const regoForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");
  updateUI();

  /* An event listener that waits for the registration form to be submitted
 * which creates a HTTP POST Request with the form data
 * It calls an API endpoint and if successful will return status code: 200
 * 
 * TODO: 
 * Form Validation
 * - Must be email and must be unique (Will return bad request if not unique )
 * - Password must have certain length and numbers/characters?
 * 
 * Handle 201 status 
 * - modal changes to login modal? 
 * - and/or successful pop up message?
 * Handle bad requests
 */
  regoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const user = form.get('username');
    const e = form.get('email');
    const pass = form.get('password');

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:5000/api/users/create", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username: user, email: e, password: pass }))

    xhttp.onload = () => alert(xhttp.status)
  })

  /* An event listener that waits for the login form to be submitted
   * which creates a HTTP POST Request with the form data.
   * It calls an auth endpoint and if successful will return status code: 200
   * Unsuccessful calls will return status code: 404
   * 
   * TODO: 
   * Form Validation
   * - Must be in email format
   * 
   * Handle 201 status 
   * - successful pop up message?
   * Handle bad requests
   */
  loginForm.addEventListener('submit', (event) => {

    event.preventDefault();


    const form = new FormData(event.target);
    const e = form.get('email');
    const pass = form.get('password');

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:5000/auth/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email: e, password: pass }))
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        let data = xhttp.responseText;
        username = JSON.parse(data).username;
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('username', username);
        // Close the modal
        var modal = document.getElementById('loginModal');
        bootstrap.Modal.getInstance(modal).hide()

        updateUI();
      }
    }

  })
}

// Logs the user out and updates UI
function logout() {
  localStorage.clear();
  updateUI();
}

// Check if the user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn');
}

// Get the username from local storage
function getUsername() {
  return localStorage.getItem('username');
}

function updateUI() {
  let username = document.querySelector('.navbar-user');
  let loginButton = document.getElementById('loginButton');
  let logoutButton = document.getElementById('logoutButton');
  let regoButton = document.getElementById('regoButton');

  if (isLoggedIn()) {
    username.innerHTML = getUsername();
    logoutButton.style.display = '';
    loginButton.style.display = 'none';
    regoButton.style.display = 'none';
  }
  else {
    username.innerHTML = "";
    logoutButton.style.display = 'none';
    loginButton.style.display = '';
    regoButton.style.display = '';
  }
}



