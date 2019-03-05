const logIn = document.querySelector('#login-form-link');
const register = document.querySelector('#register-form-link');
const containerDiv = document.querySelector('#containerDiv');

let point = 'https://dentministrator.herokuapp.com/';

let switcher = true; // var for Log In or Register


// LOGIN FORM
const loginForm = document.querySelector('.loginForm');

const email = document.querySelector('#inputUsername');
const password = document.querySelector('#inputPassword');
const rememberMe = document.querySelector('#checkRemember');
const logInBtn = document.querySelector('#logInBtn');
const forgotPass = document.querySelector('#forgotPass');

// REGISTER FORM
const registerForm = document.querySelector('.registerForm');

const regEmail = document.querySelector('#regEmail');
const regUserName = document.querySelector('#regUserName');
const regPassword = document.querySelector('#regPassword');
const regConfirmPassword = document.querySelector('#regConfirmPassword');
const gridCheck = document.querySelector('#gridCheck');
const signUp = document.querySelector('#signUp');

signUp.addEventListener('click', registerFunction);
//
// CREATE PATIENT PAGE
const createPatientDiv = document.querySelector('#createPatientDiv');

let patientName = document.querySelector("#patientName");
let patientLastName = document.querySelector("#patientLastName");
let patientEmail = document.querySelector("#patientEmail");
let patientPhoneNum = document.querySelector("#patientPhoneNum");

const emergencyMsg = document.querySelector('#emergencyMsg');
const createPatBtn = document.querySelector('#createPatBtn');
//

// ALL PATIENTS DIV

let allPatDiv = document.querySelector('#allPatients');

// PATIENT CARD 

function patCard(name, lastName, phone, email, id) {
    return `<div class="card col-4" style="width: 18rem;">
  <img src="./images/doctor2.jpg" class="logo" alt="...">
  <div class="card-body">
    <p class="card-title">${name}</p>
    <p class="card-text">${lastName}</p>
    <p class="card-text">${phone}</p>
    <p class="card-text">${email}</p>
    <p class="card-text">${id}</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`
}

// GO TO CREATE PATIENT BUTTON

let goToCreatePat = document.querySelector("#goToCreatePat");
goToCreatePat.onclick = function () {
    console.log(this);

    allPatDiv.classList.add("hide");
    createPatientDiv.classList.remove("hide");
    this.className += " hide";  // sakrio si button, probaj da ga stavis u div koji ces sakriti 
    getAllPatients();

}

if (localStorage.getItem("token") != undefined) {
    containerDiv.classList.add("hide");
    createPatientDiv.classList.add("hide");
    goToCreatePat.classList.remove("hide");
    
    getAllPatients();
}

createPatBtn.addEventListener('click', function (e) {
    createPatientFun(e)
});

//

logIn.addEventListener('click', showLogin);
register.addEventListener('click', showRegister);

logInBtn.addEventListener('click', function (event) {
    event.preventDefault();
    logInFunction();
});

function showLogin() {
    registerForm.classList.add('hide');
    loginForm.classList.remove('hide');
    logIn.classList.add('activeUnderline');
    register.classList.remove('activeUnderline');
    console.log();
}

function showRegister() {
    loginForm.classList.add('hide');
    registerForm.classList.remove('hide');
    register.classList.add('activeUnderline');
    logIn.classList.remove('activeUnderline');
}

function getAllPatients() {
    let token = localStorage.getItem("token");

    fetch(`${point}patients`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },

    })
        .then((res) => {

            if (res.status == 401) {
                containerDiv.classList.remove('hide');
                return;
            }
            return res.json()
        })
        .then((data) => {
            console.log(data.patients);
            let patient = '';
            data.patients.map(pat => {
                patient += patCard(pat.firstName, pat.lastName, pat.phoneNums, pat.email, pat._id);
                console.log(typeof patient);
                return patient;
            })

            allPatDiv.innerHTML = patient;
        });

}

function registerFunction(event) {
    event.preventDefault();

    let emailNewUser = regEmail.value;
    let userNameNewUser = regUserName.value;

    let passNewUser = regPassword.value;
    let confPassNewUser = regConfirmPassword.value;

    if (validate(regEmail, regUserName, regPassword, regConfirmPassword)) {
        return;
    }

    fetch(`${point}auth/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailNewUser,
            password: passNewUser,

        })
    }).then((res) => {
        console.log(res);
        if (res.status == 422) {
            return alert("Unprocessable entity. Duplicate email")
        }

        res.json();
    }).then((data) => {
        console.log(data);

        regEmail.value = '';
        regUserName.value = '';
        regPassword.value = '';
        regConfirmPassword.value = '';
        return;
    })
        .catch((err) => {
            console.log(err.message);

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

function logInFunction() {

    if (validate(email, password)) {
        return;
    }

    fetch(`${point}auth/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.accessToken == undefined) {
                console.log(data.error);
                email.style.backgroundColor = 'red';
                password.style.backgroundColor = 'red';
                email.placeholder = data.error;
                password.placeholder = data.error;
            } else {
                localStorage.setItem('token', data.accessToken);
                containerDiv.classList.add("hide");
                goToCreatePat.classList.remove('hide');
                getAllPatients();
                // createPatientDiv.classList.remove("hide");
            }
            email.value = '';
            password.value = '';
        })
        .catch(() => console.log('*Niste ulogovani*'))
}

function createPatientFun(e) {
    e.preventDefault();
    emergencyMsg.textContent = '';
    let token = localStorage.getItem('token');

    fetch(`${point}patients`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            firstName: patientName.value,
            lastName: patientLastName.value,
            email: patientEmail.value,
            phoneNums: [`${patientPhoneNum.value}`]
        })
    }).then((res) => {
        console.log(res);

        if (res.status == 400) {
            emergencyMsg.style.color = 'red';
            emergencyMsg.textContent = 'Unesite ispravno podatke!';
            // patientName.value = "";
            // patientLastName.value = "";
            // patientEmail.value = "";
            // patientPhoneNum.value = "";
            // createPatientDiv.classList.add('hide');
            // containerDiv.classList.remove("hide");

            return;
        }
        if (res.status == 500) {
            emergencyMsg.style.color = 'red';
            emergencyMsg.textContent = 'Mail je vec u upotrebi';
            // patientName.value = "";
            // patientLastName.value = "";
            // patientEmail.value = "";
            // patientPhoneNum.value = "";
            // createPatientDiv.classList.add('hide');
            // containerDiv.classList.remove("hide");

            return;
        }

        patientName.value = "";
        patientLastName.value = "";
        patientEmail.value = "";
        patientPhoneNum.value = "";
        createPatientDiv.classList.add('hide');
        
        allPatDiv.classList.remove("hide");
        goToCreatePat.classList.remove("hide");
        getAllPatients();

        return res.json();
    }).then(data => {
        console.log(data);

    }).catch((err) => {
            console.log(err);
        })
}