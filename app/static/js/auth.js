window.onload = function () {
  const regoForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("register-username-input");
  const usernameValidationText = document.getElementById("username-validation-text");
  const emailInput = document.getElementById("register-email-input");
  const emailValidationText = document.getElementById("email-validation-text");
  const passwordInput = document.getElementById("register-password-input");
  const passwordValidationText = document.getElementById("password-validation-text");
  const loginValidationText = document.getElementById("login-validation-text");
  /**
   *  An event listener that waits for the registration form to be submitted
   * which creates a HTTP POST Request with the form data
   * It calls an API endpoint and creates a new user in the database.
   * 
   * The form is validated so that the fields are nonempty, and further conditions are also met (specified in other functions)
   * If those conditions are not met, the POST request is not sent, and text is displayed to the user explaining the issue
   * 
   * If the POST request returns a 201 status, then the registration modal closes, and a notification appears that the account
   * Has been successfully created
   * If the POST request returns a 500 status, then the entered email is not unique, so text appears to notify the user of this
   * @param event - The submit button that triggers the event
   * @returns:
   *  If the request was successful it will return status code: 201
   *  If not, it will return status code: 500
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
        emailValidationText.innerHTML = "This email already has an account associated with it."
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
   *    In this case, the login modal closes, and the page is reloaded
   *  Unsuccessful requests will return status code: 401
   *    This means that there is no account matching the given details
   *    which is communicated by some text which appears
   */
  loginForm.addEventListener('submit', (event) => {

    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get('email');
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
      }else if (xhttp.status == 401){
        loginValidationText.innerHTML = "No account matching the given email and password was found."
      }
    }
  })
  /**
   * Tests if a String is a valid email
   * @param emailAttempt - a String to be tested
   * @returns - a String which explains any errors with the email. If there are no errors, the string is empty.
   */
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
  /**
   * Checks if a String is a valid password
   * The password must be at least 8 characters, and be sufficiently
   * distinct from the username and password.
   * @param {*} passwordAttempt - A String to be tested
   * @param {*} emailAttempt - A string representing an email.
   * @param {*} usernameAttempt - A string representing a username.
   * @returns: a String which explains any issues with the password
   */
  function checkPassword(passwordAttempt,emailAttempt,usernameAttempt){
    //inspired by https://blog.codinghorror.com/password-rules-are-bullshit/
    if (passwordAttempt == ""){
      return "";
    }else if (passwordAttempt.length < 8 && passwordAttempt != ""){
      return "Please use a password with 8 characters or more."
    }else if (passwordAttempt.toLowerCase() == emailAttempt.toLowerCase()){
      return "Please use a password which is different to your email."
    }else if (passwordAttempt.toLowerCase() == usernameAttempt.toLowerCase()){
      return "Please use a password which is different to your username."
    }
    return "";
  }
  // The event listeners below are for the purpose of showing and hiding
  // the error text related to to form fields.
  // When the user clicks on one of the text inputs, the associated error text disappears.
  // When the user clicks off one of the inputs and they have an error in what
  // they've current inputted, the error text appears.
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
  document.querySelectorAll("#loginForm input").forEach((inp) => {
    inp.addEventListener('focus', () => {
      loginValidationText.innerHTML = "";
    })
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

/**
 * Open the analysis page if the user is logged in. Otherwise, open the login modal
 */
 function openAnalysisPage(){
  if (document.getElementById("logout-button") != null){
    location.href = "/analysis";
  }else{
    var modal = document.getElementById('loginModal');
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }
}