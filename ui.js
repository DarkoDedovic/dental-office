function changeUrl() {

    allSectionDivs.forEach(sectionDiv => {

        if (sectionDiv.classList.contains("hide") == false) {
            doPushState(sectionDiv.id);
        }
    })
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

function resetLogInInputs() {
    email.value = '';
    password.value = '';
}

function getLogInData() {
    const inputsForLogIn = {
        email: email.value,
        password: password.value
    }
    return JSON.stringify(inputsForLogIn);
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

function resetRegisterInputs() {
    regEmail.value = '';
    regUserName.value = '';
    regPassword.value = '';
    regConfirmPassword.value = '';
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

function openSingleCard(name, lastName, phone, email, id) {
    singleCardSection.removeChild(singleCardSection.childNodes[0]);
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');

        if (sectionDiv.id == 'singleCardSection') {
            sectionDiv.classList.remove("hide");
        }
    })

    // create node of string 'patients'
    const nodeCard = document.createRange().createContextualFragment(createSingleCard(name, lastName, phone, email, id));
    singleCardSection.appendChild(nodeCard);
    changeUrl();
}

function createSingleCard(name, lastName, phone, email, id) {
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
    return singlePatientCard;
}

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