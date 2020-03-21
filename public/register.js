var initialValue = 0;

const login = $(".form-container .primary-log-in")[0];
const register = $(".form-container .primary-register")[0];
show(initialValue);


$(".form-container .secondary-button").click(() => {
  if (initialValue == 0)
    initialValue = 1;
  else
    initialValue = 0;
  show(initialValue);
});

function show(val) {
  if (val == 0) {
    register.style.display = "none";
    login.style.display = "block";
  } else {
    login.style.display = "none";
    register.style.display = "block";
  }
}


function validatePrimaryLogin() {
  let unameLogin = $(".primary-log-in form .username input.value");
  let passLogin = $(".primary-log-in form .password input.value");
  if (unameLogin.value.trim() == "" || passLogin.value.trim() == "") {
    alert("Empty values not allowed!");
    return false;
  } else {
    return true;
  }
};

function validatePrimaryRegsiter() {
  let unameRegister = $(".primary-regsiter form .username input.value");
  let passRegister = $(".primary-regsiter form .password input.value");
  let emailRegister = $(".primary-regsiter form .email input.value");
  if (unameRegister.value.trim() == "" || passRegister.value.trim() == "" || emailRegister.value.trim() == "") {
    alert("Empty values not allowed!");
    return false;
  } else {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailRegister)) {
        return (true);
      }
      alert("You have entered an invalid email address!");
      return (false);
  }
};
