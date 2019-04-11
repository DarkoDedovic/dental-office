// validirati da li je token istekao ili nije, ako jeste, prikazi LOGin stranu, ako nije - prikazi ALL PATIENTS
//kad ima token koji nije validan, otvori i logIn i createPatientNavigationButton  stranu 

const logInAndRegisterSection = document.querySelector('#logInAndRegisterSection');
const logInDiv = document.querySelector('#login-form-link');
const registerDiv = document.querySelector('#register-form-link');
const allSectionDivs = document.querySelectorAll("section");

const baseUrl = window.location.origin;

// https://dentministrator.herokuapp.com/api/ 

const point = 'https://dentministrator.herokuapp.com/';
const ENDPOINT_PATIENTS = `${point}patients`;
const ENDPOINT_SIGN_IN = `${point}auth/signin`;
const ENDPOINT_SIGN_UP = `${point}auth/signup`;
const ENDPOINT_DELETE = `${point}patients/`;

// LOGIN FORM
const loginFormDiv = document.querySelector('.loginForm');

const email = document.querySelector('#inputUsername');
const password = document.querySelector('#inputPassword');
const rememberMe = document.querySelector('#checkRemember');
const logInBtn = document.querySelector('#logInBtn');
const forgotPass = document.querySelector('#forgotPass');

// REGISTER FORM
const registerFormDiv = document.querySelector('.registerForm');

const regEmail = document.querySelector('#regEmail');
const regUserName = document.querySelector('#regUserName');
const regPassword = document.querySelector('#regPassword');
const regConfirmPassword = document.querySelector('#regConfirmPassword');
const gridCheck = document.querySelector('#gridCheck');
const signUp = document.querySelector('#signUp');

signUp.addEventListener('click', registerFunction);

// CREATE PATIENT PAGE

const createPatientSection = document.querySelector('#createPatientSection');

const patientNameInput = document.querySelector("#patientNameInput");
const patientLastNameInput = document.querySelector("#patientLastNameInput");
const patientEmailInput = document.querySelector("#patientEmailInput");
const patientPhoneInput = document.querySelector("#patientPhoneInput");

const emergencyMsg = document.querySelector('#emergencyMsg');
const createPatientButton = document.querySelector('#createPatientButton');

// SINGLE PAGE DIV

const singleCardSection = document.querySelector("#singleCardSection");

// ALL PATIENTS DIV
const patientsSection = document.querySelector("#patientsSection");
const allPatientsDiv = document.querySelector('#allPatientsDiv');

// PATIENT CARD 

// GO TO CREATE PATIENT BUTTON

const createPatientNavigationButton = document.querySelector("#createPatientNavigationButton");


window.onload = function (e) {
    if (localStorage.getItem("token") == undefined) {
        logInAndRegisterSection.classList.remove("hide");
        changeUrl();

    } else {
        patientsSection.classList.remove("hide");
        getAllPatients();
        changeUrl();
    }
}

window.onpopstate = function (event) {
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');
        if (event.target.location.href.includes(sectionDiv.id)) {
            sectionDiv.classList.remove('hide');
        }
    })
}

function doPushState(id) {
    window.history.pushState({}, null, '/' + id);
}