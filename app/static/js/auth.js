window.onload = function () {
  const regoForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");
  /**
   *  An event listener that waits for the registration form to be submitted
   * which creates a HTTP POST Request with the form data
   * It calls an API endpoint and creates a new user in the database.
   * @param event - The submit button that triggers the event
   * @returns:
   *  If the request was successful it will return status code: 201
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
    xhttp.open("POST", "api/users/create", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username: user, email: e, password: pass }))

    xhttp.onload = () => {
      if (xhttp.status == 201) {
        // Change modal to log modal?
      }
    }
  })

  /** 
   * An event listener that waits for the login form to be submitted
   * which creates a HTTP POST Request with the form data.
   * It calls an auth endpoint which will login the user.
   * @param event - The submit button that triggers the event
   * @returns:
   *  If the request was successful will return status code: 200
   *  Unsuccessful requests will return status code: 404
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
    xhttp.open("POST", "auth/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email: e, password: pass }))
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        // Close the modal
        var modal = document.getElementById('loginModal');
        bootstrap.Modal.getInstance(modal).hide()
        // Reload the current page
        location.reload();
      }
    }

  })
}

/** 
 * Makes a request to the auth endpoint which handles logging out the user.
 * @returns:
 * If the request is successful it will return the status code: 200
 */
function logout() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "auth/logout", true);
  xhttp.send()
  xhttp.onload = () => {
    if (xhttp.status == 200) {
      // reload the current page
      location.reload();
    }
  }
}