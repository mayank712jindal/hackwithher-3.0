function emailValidate(e){
    const validationArea = document.getElementById("emailValidate");
      if (!(/^[a-zA-Z0-9]\.{0,1}([a-zA-Z0-9]+\.)*[a-zA-Z0-9]+@([a-z]+\.)+[a-z]{2,4}$/.test(e.value))) {
        validationArea.style.display = 'block';
        validationArea.innerText = "Please Enter a Valid Email";
        e.style.outline = "none";
        e.style.border = "2px solid red";
      } else {
        validationArea.style.display = null;
        validationArea.innerText = null;
        e.style.outline = null;
        e.style.border = null;
      }
}
function confrmpwdValidate(){
    const pwd = document.getElementById('pwd');
    const confrmpwd = document.getElementById('confrmpwd');
    const validationArea = document.getElementById("confrmpwdValidate");
    if(pwd.value !== confrmpwd.value){
        validationArea.style.display = 'block';
        validationArea.innerText = 'Confirm password should match with password';
        confrmpwd.style.outline = 'none';
        confrmpwd.style.border = '2px solid red';
    }else{
        validationArea.style.display = null;
        validationArea.innerText = null;
        confrmpwd.style.outline = null;
        confrmpwd.style.border = null;
    }
}
function signup(){
    for(let ele of document.getElementsByClassName('validate-text')){
        if(ele.innerHTML !== ''){
            return false;
        }
        return true;
    }
}
console.log('a');