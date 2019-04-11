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

function createPatientCards(name, lastName, phone, email, id) {
    return `<div class="card" id="pat${id}" style="width: 18rem;">
                <img src="./images/doctor4.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                Ime i Prezime:
                    <h5 class="card-title">${name} ${lastName}</h5>
                    <p class="card-text">${id}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${phone}</li>
                    <li class="list-group-item">${email}</li>
                </ul>
                <div class="card-body">
                    <a href="#" class="card-link">Card link</a>
                    <button class="btn btn-primary patientButton">Delete Patient</button> 
                </div>
            </div>`
}

// GO TO CREATE PATIENT BUTTON

const createPatientNavigationButton = document.querySelector("#createPatientNavigationButton");
createPatientNavigationButton.onclick = function (e) {
    e.preventDefault();
    patientsSection.classList.add("hide");
    createPatientSection.classList.remove("hide");
    this.classList.add('hide');
    changeUrl();
}

logInBtn.onclick = function (e) {
    e.preventDefault();
    logInFunction();
};

createPatientButton.onclick = function (e) {
    createPatientFunction(e);
};

logInDiv.addEventListener('click', showLogin);
registerDiv.addEventListener('click', showRegister);

function showLogin() {
    registerFormDiv.classList.add('hide');
    loginFormDiv.classList.remove('hide');
    logInDiv.classList.add('activeUnderline');
    registerDiv.classList.remove('activeUnderline');
}

function showRegister() {
    loginFormDiv.classList.add('hide');
    registerFormDiv.classList.remove('hide');
    registerDiv.classList.add('activeUnderline');
    logInDiv.classList.remove('activeUnderline');
}

function getAllPatients() {
    while (allPatientsDiv.firstChild) {
        allPatientsDiv.firstChild.remove();
    }
    const token = localStorage.getItem("token");

    httpGet(ENDPOINT_PATIENTS, true)

        .then(data => {

            data.patients.map(pat => {

                const patients = createPatientCards(pat.firstName, pat.lastName, pat.phoneNums, pat.email, pat._id);
                // create node of string 'patients'
                const nodeDiv = document.createRange().createContextualFragment(patients);

                nodeDiv.querySelector(".card").addEventListener('click', event => {
                    openSingleCard(pat.firstName, pat.lastName, pat.phoneNums, pat.email, pat._id)
                });

                nodeDiv.querySelector(".patientButton").addEventListener('click', event => {
                    deletePatient(pat._id);
                    event.stopPropagation();
                });

                allPatientsDiv.appendChild(nodeDiv);

            });
        })
}

function openSingleCard(name, lastName, phone, email, id) {
    singleCardSection.removeChild(singleCardSection.childNodes[0]);
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');

        if (sectionDiv.id == 'singleCardSection') {
            sectionDiv.classList.remove("hide");
        }
    })

    const singlePatientCard = `<div class="card" id="pat${id}" style="width: 18rem;">
                                    <img src="./images/doctor4.jpg" class="card-img-top" alt="...">
                                    <div class="card-body">
                                    Ime i Prezime:
                                        <h5 class="card-title">${name} ${lastName}</h5>
                                        <p class="card-text">${id}</p>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">${phone}</li>
                                        <li class="list-group-item">${email}</li>
                                    </ul>
                                    <div class="card-body">
                                        <a href="#" class="card-link">Card link</a>
                                        <button class="btn btn-primary edit">Edit</button> 
                                    </div>
                              </div>`
    // create node of string 'patients'
    const nodeCard = document.createRange().createContextualFragment(singlePatientCard);
    singleCardSection.appendChild(nodeCard);
    changeUrl();
}

function deletePatient(id) {

    httpDelete(`${ENDPOINT_DELETE}${id}`, true)

        .then(() => window.location.reload())
}

function getDataFromRegInputs() {
    const inputsForRegister = {
        email: regEmail.value,
        password: regPassword.value,
        userNameNewUser: regUserName.value,
        confirmPasswordNewUser: regConfirmPassword.value
    }
    return JSON.stringify(inputsForRegister)
}

function resetRegisterInputs() {
    regEmail.value = '';
    regUserName.value = '';
    regPassword.value = '';
    regConfirmPassword.value = '';
}

function registerFunction(event) {
    event.preventDefault();
    if (validate(regEmail, regUserName, regPassword, regConfirmPassword)) {
        return;
    }
    httpPost(ENDPOINT_SIGN_UP, false, getDataFromRegInputs())
        .then(() => {
            resetRegisterInputs();
            return;
        }).catch(data => {
            alert(data);
        })
}

function validate(regEmail, regUserName, regPassword, regConfirmPassword) {

    let validation = false;

    [...arguments].forEach(arg => {
        arg.style.backgroundColor = 'white';
        if (arg.value == "") {
            arg.style.backgroundColor = 'red';
            validation = true;
        }
    })
    if (arguments.length > 2) {
        if (arguments[2].value !== arguments[3].value) {
            arguments[2].style.backgroundColor = 'red';
            arguments[3].style.backgroundColor = 'red';
            validation = true;
        }
    }
    return validation;
}

function getLogInData() {
    const inputsForLogIn = {
        email: email.value,
        password: password.value
    }
    return JSON.stringify(inputsForLogIn);
}

function resetLogInInputs() {
    email.value = '';
    password.value = '';
}

function logInFunction() {

    if (validate(email, password)) {
        return;
    }

    httpPost(ENDPOINT_SIGN_IN, false, getLogInData())
        // da li ovo obrisati ispod i greske hvatati samo u sendData funkciji ???
        .then(data => {
            if (data.accessToken == undefined) {
                resetLogInInputs();
                email.style.backgroundColor = 'red';
                password.style.backgroundColor = 'red';
                email.placeholder = data.error;
                password.placeholder = data.error;
            } else {
                localStorage.setItem('token', data.accessToken);
                logInAndRegisterSection.classList.add("hide");
                patientsSection.classList.remove('hide');
                getAllPatients();
                changeUrl();

            }

        }).catch(data => console.log(data))
}

function getCreatePatientData() {
    const inputsForCreatePatient = {
        firstName: patientNameInput.value,
        lastName: patientLastNameInput.value,
        email: patientEmailInput.value,
        phoneNums: [`${patientPhoneInput.value}`]
    };
    return JSON.stringify(inputsForCreatePatient);
}

function resetUI() {
    patientNameInput.value = "";
    patientLastNameInput.value = "";
    patientEmailInput.value = "";
    patientPhoneInput.value = "";
    createPatientSection.classList.add('hide');
    patientsSection.classList.remove("hide");
    createPatientNavigationButton.classList.remove("hide");
}

function createPatientFunction(event) {
    event.preventDefault();
    emergencyMsg.textContent = '';

    httpPost(ENDPOINT_PATIENTS, true, getCreatePatientData())
        .then(data => {
            resetUI();
            getAllPatients();
            changeUrl();
        }).catch((err) => {
            console.log(err);
            emergencyMsg.style.color = 'red';
            emergencyMsg.textContent = 'Unesite ispravno podatke!';
            emergencyMsg.style.color = 'red';
            emergencyMsg.textContent = 'Mail je vec u upotrebi';
        })
}


function changeUrl() {

    allSectionDivs.forEach(sectionDiv => {

        if (sectionDiv.classList.contains("hide") == false) {
            doPushState(sectionDiv.id);
        }
    })
}

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

function doPushState(id) {
    window.history.pushState({}, null, '/' + id);
}

window.onpopstate = function (event) {
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');
        if (event.target.location.href.includes(sectionDiv.id)) {
            sectionDiv.classList.remove('hide');
        }
    })
}

function sendData(url, method, isAuth, body) {

    const params = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    if (body) {
        params.body = body;
    }

    if (isAuth) {
        params.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }

    // proveriti gde izbacuje gresku promise.rejected()
    return fetch(url, params).then(res => {

        if (res.status == 400) {
            return Promise.reject('invalid data')
        }
        if (res.status == 401) {
            logInAndRegisterSection.classList.remove('hide');
            return Promise.reject('invalid data')
        }
        if (res.status == 422) {
            return Promise.reject('Unprocessable entity. Duplicate entry.');
        }
        if (res.status == 500) {
            return Promise.reject('server error');
        }
        return res.json();
    });
}

function httpPost(url, isAuth, body) {
    return sendData(url, 'POST', isAuth, body);
}

function httpGet(url, isAuth) {
    return sendData(url, 'GET', isAuth);
}

function httpDelete(url, isAuth) {
    return sendData(url, 'DELETE', isAuth);
}