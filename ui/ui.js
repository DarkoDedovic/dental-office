const show = (page) => {
    hideAllPagesAndSubpages();

    switch (page) {
        case PAGE_LOGIN:
            logInAndRegisterSection.classList.remove('hide');
            loginFormDiv.classList.remove('hide');
            doPushState(loginFormDiv.id);
            break;
        case PAGE_REGISTER:
            logInAndRegisterSection.classList.remove('hide');
            registerFormDiv.classList.remove('hide');
            doPushState(registerFormDiv.id);
            break;
        case PAGE_PATIENTS:
            patientsSection.classList.remove('hide');
            doPushState(patientsSection.id);
            break;
    
        default:
            break;
    }
}

const hideAllPagesAndSubpages = () => {
    const all = document.querySelectorAll(".page, .subpage");

    all.forEach(el => {
        el.classList.add('hide');
    });
}

const getCreatePatientData = () => {
    const inputsForCreatePatient = {
        firstName: patientNameInput.value,
        lastName: patientLastNameInput.value,
        email: patientEmailInput.value,
        phoneNums: [`${patientPhoneInput.value}`]
    };
    return JSON.stringify(inputsForCreatePatient);
}

const resetUI = (parentOfInputs, errorMsg, showOrHideButton, buttonForShown) => {
    const inputsNodeList = parentOfInputs.querySelectorAll('input');
    inputsNodeList.forEach(el => {
        el.value = '';
    })
    errorMsg.textContent = '';
    if (showOrHideButton) {
        buttonForShown.classList.remove('hide');
    }
}

const getLogInData = () => {
    const inputsForLogIn = {
        email: email.value,
        password: password.value
    }
    return JSON.stringify(inputsForLogIn);
}

const validate = parentOfInputs => {
    let validation = false;
    const inputsNodeList = parentOfInputs.querySelectorAll('.form-control');
    console.log(inputsNodeList.length);

    inputsNodeList.forEach(input => {
        input.style.backgroundColor = 'white';
        if (input.value == "") {
            input.style.backgroundColor = 'red';
            validation = true;
        }
    })
    if (inputsNodeList.length > 2) {
        if (inputsNodeList[2].value !== inputsNodeList[3].value) {
            inputsNodeList[2].style.backgroundColor = 'red';
            inputsNodeList[3].style.backgroundColor = 'red';
            validation = true;
        }
    }
    return validation;
}

const getDataFromRegInputs = () => {
    const inputsForRegister = {
        email: regEmail.value,
        password: regPassword.value,
        userNameNewUser: regUserName.value,
        confirmPasswordNewUser: regConfirmPassword.value
    }
    return JSON.stringify(inputsForRegister)
}

const openSingleCard = (name, lastName, phone, email, id) => {
    singleCardSection.removeChild(singleCardSection.childNodes[0]);
    show(PAGE_SINGLE_PATIENT);

    const nodeCard = document.createRange().createContextualFragment(createSingleCard(name, lastName, phone, email, id));
    const closeLink = nodeCard.querySelector("#closeLink");

    closeLink.onclick = () => window.history.back();
    singleCardSection.appendChild(nodeCard);
}

const createSingleCard = (name, lastName, phone, email, id) => {
    const singlePatientCard = `<div class="card" id="pat${id}" style="width: 18rem;">
    <div class="flex justify-start"><a id="closeLink"><i class="fas fa-times" style='size: 2px'></i>Zatvori</a></div>
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
    <div class="card-body flex justify-between">     
            <a href="#" class="card-link">Card link</a> 
            <a href="#" class="card-link edit">Edit Patient</a>    
    </div>
</div>`
    return singlePatientCard;
}

createPatientNavigationButton.onclick = e => {
    e.preventDefault();
    show(PAGE_CREATE_PATIENT);
}

signUp.addEventListener('click', event => {
    registerFunction(event);
});

const setLoginClickListener = (onLogin) => {
    logInBtn.onclick = e => {
        e.preventDefault();

        const logInInputs = document.querySelector('#logInFormDiv');
    
        if (!validate(logInInputs)) {
            onLogin(getLogInData());
        }
    };
}

createPatientButton.onclick = e => {
    createPatientFunction(e);
};

logInDiv.addEventListener('click', () => {
    show(PAGE_LOGIN);
    logInDiv.classList.add('activeUnderline');
    registerDiv.classList.remove('activeUnderline');
});

registerDiv.addEventListener('click', () => {
    show(PAGE_REGISTER);
    registerDiv.classList.add('activeUnderline');
    logInDiv.classList.remove('activeUnderline');
});

const logOutFunction = () => {
    localStorage.removeItem('token');
}

logOutButton.addEventListener("click", () => {
    logOutFunction();
    show(PAGE_LOGIN);

});

const createPatientCards = (name, lastName, phone, email, id) => {
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
                <div class="card-body flex justify-between">
                
                    <a href="#" class="card-link">Card link</a>
                    <a href="#" class="deletePatientButton card-link">Delete Patient</a> 
                </div>
            </div>`
}

function doPushState(id) {
    window.history.pushState({}, null, '/' + id);
}