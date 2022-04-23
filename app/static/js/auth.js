const regoForm = document.getElementById("registrationForm");

/* An event listener that waits for the registration form to be submitted
 * which creates a HTTP POST Request with the form data
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