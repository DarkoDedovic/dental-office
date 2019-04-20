const logInAndRegisterSection = document.querySelector('#logInAndRegisterSection');
const logInDiv = document.querySelector('#login-form-link');
const registerDiv = document.querySelector('#register-form-link');

//nodeList = logIn and reg div
const logInAndRegDivsNodeList = logInAndRegisterSection.querySelectorAll('form');

// LOGIN FORM
const loginFormDiv = document.querySelector('.loginForm');

const email = document.querySelector('#inputUsername');
const password = document.querySelector('#inputPassword');
const logInErrorMsg = document.querySelector("#logInErrorMsg");
const rememberMe = document.querySelector('#checkRemember');
const logInBtn = document.querySelector('#logInBtn');
const forgotPass = document.querySelector('#forgotPass');

// REGISTER FORM
const registerFormDiv = document.querySelector('.registerForm');

const regEmail = document.querySelector('#regEmail');
const regUserName = document.querySelector('#regUserName');
const regPassword = document.querySelector('#regPassword');
const regConfirmPassword = document.querySelector('#regConfirmPassword');
const registerErrorMsg = document.querySelector("#registerErrorMsg");
const gridCheck = document.querySelector('#gridCheck');
const signUp = document.querySelector('#signUp');

// CREATE PATIENT PAGE

const createPatientSection = document.querySelector('#createPatientSection');

const patientNameInput = document.querySelector("#patientNameInput");
const patientLastNameInput = document.querySelector("#patientLastNameInput");
const patientEmailInput = document.querySelector("#patientEmailInput");
const patientPhoneInput = document.querySelector("#patientPhoneInput");

const createPatientErrorMsg = document.querySelector('#createPatientErrorMsg');
const createPatientButton = document.querySelector('#createPatientButton');

// SINGLE PAGE DIV

const singleCardSection = document.querySelector("#singleCardSection");

// ALL PATIENTS DIV

const patientsSection = document.querySelector("#patientsSection");
const allPatientsDiv = document.querySelector('#allPatientsDiv');
const logOutButton = document.querySelector('#logOut');

// GO TO CREATE PATIENT BUTTON

const createPatientNavigationButton = document.querySelector("#createPatientNavigationButton");