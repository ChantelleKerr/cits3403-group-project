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
    const username = form.get('username');
    const email = form.get('email');
    const password = form.get('password');

    let isValid = true;

    if (email == "" || checkEmail(email) != ""){
      if (email == ""){
        emailValidationText.innerHTML = "This field is required."
      }
      isValid = false;
    }
    if (password == "" || checkPassword(password,email,username) != ""){
      if (password == ""){
        passwordValidationText.innerHTML = "This field is required."
      }
      isValid = false;
    }
    if (username == ""){
      usernameValidationText.innerHTML = "This field is required."
      isValid = false;
    }
    if (!isValid){
      return;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "api/users/create", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username: username, email: email, password: password }))

    xhttp.onload = () => {
      if (xhttp.status == 201) {
        let messageModal = document.getElementById("messageModal");
        bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
        bootstrap.Modal.getOrCreateInstance(messageModal).show();
        document.getElementById("message").innerHTML = "Account successfully created";
      }else if (xhttp.status == 500){
        document.getElementById("email-validation-text").innerHTML = "This email already has an account associated with it."
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
   *  Unsuccessful requests will return status code: 401
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
    const email = form.get('email');
    console.log(email);
    const password = form.get('password');
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "auth/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email: email, password: password }))
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

  function checkEmail(emailAttempt) {
    if (emailAttempt == ""){
      return "";
    }else if (!emailAttempt.includes("@")){
      return 'An email must include an "@" sign.';
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAttempt)){
      //imperfect but pretty good simple regex for emails. The "fully accurate" regular expressions are all very long
      return "Invalid email.";
    }
    return "";
  }
  function checkPassword(passwordAttempt,e,u){
    //inspired by https://blog.codinghorror.com/password-rules-are-bullshit/
    if (passwordAttempt == ""){
      return "";
    }else if (passwordAttempt.length < 8 && passwordAttempt != ""){
      return "Please use a password with 8 characters or more."
    }else if (passwordAttempt.toLowerCase() == e.toLowerCase()){
      return "Please use a password which is different to your email."
    }else if (passwordAttempt.toLowerCase() == u.toLowerCase()){
      return "Please use a password which is different to your username."
    }
    return "";
  }
  
  const usernameInput = document.getElementById("register-username-input");
  const usernameValidationText = document.getElementById("username-validation-text");
  const emailInput = document.getElementById("register-email-input");
  const emailValidationText = document.getElementById("email-validation-text");
  const passwordInput = document.getElementById("register-password-input");
  const passwordValidationText = document.getElementById("password-validation-text");
  usernameInput.addEventListener('focus', () =>{
    usernameValidationText.innerHTML = "";
  })
  emailInput.addEventListener('focus', () => {
    emailValidationText.innerHTML = "";
  })
  emailInput.addEventListener('blur', () => {
    emailValidationText.innerHTML = checkEmail(emailInput.value);
  })
  passwordInput.addEventListener('focus', () => {
    passwordValidationText.innerHTML = "";
  })
  passwordInput.addEventListener('blur', () => {
    passwordValidationText.innerHTML = checkPassword(passwordInput.value, emailInput.value, usernameInput.value);
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