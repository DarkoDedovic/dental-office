// validirati da li je token istekao ili nije, ako jeste, prikazi LOGin stranu, ako nije - prikazi ALL PATIENTS
//kad ima token koji nije validan, otvori i logIn i createPatientNavigationButton  stranu 
//nove pacijente nekada lepi na poslendje mesto, nekada na prvo ? 
//dodati back button na create patient page, na mobile vers


window.onload = () => {
    console.log('ONLOAD');

    setLoginClickListener((loginData) => {
        logInFunction(loginData).then(data => {
            localStorage.setItem('token', JSON.stringify(data));
            show(PAGE_PATIENTS);
            getAllPatients();
            resetUI(loginFormDiv, logInErrorMsg);
        }).catch(data => {
            logInErrorMsg.style.color = 'red';
            logInErrorMsg.textContent = data;
        });
    });

    if (hasToken()) {
        show(PAGE_PATIENTS);
    } else {
        getAllPatients();
        show(PAGE_LOGIN);
    }
}

window.onpopstate = () => {
    if (hasToken()) {
        show(PAGE_LOGIN);
    }
    allSectionDivs.forEach(sectionDiv => {
        sectionDiv.classList.add('hide');
        if (event.target.location.href.includes(sectionDiv.id)) {
            sectionDiv.classList.remove('hide');
        }
        // if (event.target.location.href.includes('registerFormDiv') || event.target.location.href.includes('logInFormDiv')) {
        //     // let idElem = window.location.pathname.split('/')[1];
        //     // console.log(idElem);
        //     // NAMESTITI ONPOPSTATE ZA LOGIN I REGISTER 
        //     // let shownElem = document.querySelector(`#${idElem}`)
        //     // console.log(shownElem);
        //     logInAndRegisterSection.classList.remove('hide');
        //     // show(logInAndRegDivsNodeList, shownElem);
        // }
    })
}

