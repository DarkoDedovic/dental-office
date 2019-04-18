const httpPost = (url, isAuth, body) => {
    return sendData(url, 'POST', isAuth, body);
}

const httpGet = (url, isAuth) => {
    return sendData(url, 'GET', isAuth);
}

const httpDelete = (url, isAuth) => {
    return sendData(url, 'DELETE', isAuth);
}

const sendData = (url, method, isAuth, body) => {

    const params = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    if (body) {
        params.body = body;
    }

    if (isAuth) {
        params.headers['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('token')).accessToken;
    }

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

const createPatientFunction = event => {
    event.preventDefault();
    createPatientErrorMsg.textContent = '';

    httpPost(ENDPOINT_PATIENTS, true, getCreatePatientData())
        .then(data => {
            show(allSectionDivs, patientsSection);
            getAllPatients();
            resetUI(createPatientSection, createPatientErrorMsg, true, createPatientNavigationButton);
        }).catch(err => {
            createPatientErrorMsg.style.color = 'red';
            createPatientErrorMsg.textContent = err;
        })
}

const logInFunction = () => {
    const logInInputs = document.querySelector('#logInFormDiv');
    
    if (validate(logInInputs)) {
        return;
    }

    httpPost(ENDPOINT_SIGN_IN, false, getLogInData())
        // da li ovo obrisati ispod i greske hvatati samo u sendData funkciji ???
        .then(data => {
            localStorage.setItem('token', JSON.stringify(data));
            show(allSectionDivs, patientsSection);
            getAllPatients();
            resetUI(loginFormDiv, logInErrorMsg);
        }).catch(data => {
            logInErrorMsg.style.color = 'red';
            logInErrorMsg.textContent = data;
        })
}

const registerFunction = event => {
    event.preventDefault();
    let registerInputs = document.querySelector("#registerFormDiv");
    
    if (validate(registerInputs)) {
        return;
    }
    httpPost(ENDPOINT_SIGN_UP, false, getDataFromRegInputs())
        .then(() => {
            show(logInAndRegDivsNodeList, loginFormDiv);
            logInDiv.classList.add('activeUnderline');
            registerDiv.classList.remove('activeUnderline');
            resetUI(registerFormDiv, registerErrorMsg, false);
        }).catch(data => {
            registerErrorMsg.style.color = 'red';
            registerErrorMsg.textContent = data;
        })
}

const deletePatient = id => {

    httpDelete(`${ENDPOINT_DELETE}${id}`, true)

        .then(() => getAllPatients())
}

const getAllPatients = () => {
    while (allPatientsDiv.firstChild) {
        allPatientsDiv.firstChild.remove();
    }
    const token = JSON.parse(localStorage.getItem('token')).accessToken;

    httpGet(ENDPOINT_PATIENTS, true)

        .then(data => {

            data.patients.map(pat => {

                const patients = createPatientCards(pat.firstName, pat.lastName, pat.phoneNums, pat.email, pat._id);
                // create node of string 'patients'
                const nodeDiv = document.createRange().createContextualFragment(patients);

                nodeDiv.querySelector(".card").addEventListener('click', event => {
                    openSingleCard(pat.firstName, pat.lastName, pat.phoneNums, pat.email, pat._id)
                });

                nodeDiv.querySelector(".deletePatientButton").addEventListener('click', event => {
                    deletePatient(pat._id);
                    event.stopPropagation();
                });

                allPatientsDiv.appendChild(nodeDiv);

            });
        })
}
