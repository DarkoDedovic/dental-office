function httpPost(url, isAuth, body) {
    return sendData(url, 'POST', isAuth, body);
}

function httpGet(url, isAuth) {
    return sendData(url, 'GET', isAuth);
}

function httpDelete(url, isAuth) {
    return sendData(url, 'DELETE', isAuth);
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
        params.headers['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('token')).accessToken;
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

function logInFunction() {

    if (validate(email, password)) {
        return;
    }

    httpPost(ENDPOINT_SIGN_IN, false, getLogInData())
        // da li ovo obrisati ispod i greske hvatati samo u sendData funkciji ???
        .then(data => {
            console.log(data);
            
            if (data.accessToken == undefined) {
                resetLogInInputs();
                email.style.backgroundColor = 'red';
                password.style.backgroundColor = 'red';
                email.placeholder = data.error;
                password.placeholder = data.error;
            } else {
                localStorage.setItem('token', JSON.stringify(data));
                logInAndRegisterSection.classList.add("hide");
                patientsSection.classList.remove('hide');
                getAllPatients();
                changeUrl();
            }
        }).catch(data => console.log(data))
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

function deletePatient(id) {

    httpDelete(`${ENDPOINT_DELETE}${id}`, true)

        .then(() => window.location.reload())
}

function getAllPatients() {
    while (allPatientsDiv.firstChild) {
        allPatientsDiv.firstChild.remove();
    }
    const token = JSON.parse(localStorage.getItem('token')).accessToken;
    console.log(token);
    

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