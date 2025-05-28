let password = document.getElementById('password')
let image = document.getElementById('image')

image.onclick = function(){
    if(password.type=="password"){
        password.type="text"
        image.src = "open.png"
    }
    else if(password.type == "text"){
        password.type="password"
        image.src="hide.png"
    }
    
}
