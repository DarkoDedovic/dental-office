// validirati da li je token istekao ili nije, ako jeste, prikazi LOGin stranu, ako nije - prikazi ALL PATIENTS
//kad ima token koji nije validan, otvori i logIn i createPatientNavigationButton  stranu 
//nove pacijente nekada lepi na poslendje mesto, nekada na prvo ? 
//register - namestiti error msg i color, proveriti da li radi lepo 

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

//nodeList = logIn and reg div
const logInAndRegDivsNodeList = logInAndRegisterSection.querySelectorAll('form');
console.log(logInAndRegDivsNodeList);


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

signUp.addEventListener('click', function (event) {
    registerFunction(event)
});

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

window.onload = function (e) {
    if (JSON.parse(localStorage.getItem("token")) == undefined) {
        console.log('onload');

        show(allSectionDivs, logInAndRegisterSection);
    } else {
        getAllPatients();
        show(allSectionDivs, patientsSection)
    }
}

window.onpopstate = function (event) {
    if (JSON.parse(localStorage.getItem("token")) == undefined) {
        show(allSectionDivs, logInAndRegisterSection);
    }
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');
        if (event.target.location.href.includes(sectionDiv.id)) {
            sectionDiv.classList.remove('hide');
        }
        if (event.target.location.href.includes('registerFormDiv') || event.target.location.href.includes('logInFormDiv')) {
            // let idElem = window.location.pathname.split('/')[1];
            // console.log(idElem);
            // NAMESTITI ONPOPSTATE ZA LOGIN I REGISTER 
            // let shownElem = document.querySelector(`#${idElem}`)
            // console.log(shownElem);
            logInAndRegisterSection.classList.remove('hide');
            // show(logInAndRegDivsNodeList, shownElem);
        }
    })
}

function doPushState(id) {
    window.history.pushState({}, null, '/' + id);
}