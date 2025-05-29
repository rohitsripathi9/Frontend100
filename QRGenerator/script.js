
let qrBox = document.getElementById("qr-box")
let qrImg = document.getElementById("qr-img")
let qrText = document.getElementById("qr-text")

function Generator(){
    if(qrText.value.length>0){
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+ qrText.value;
    qrBox.classList.add("show-img");
    }
    else{
        qrText.classList.add("error")
        setTimeout(()=>{
            qrText.classList.remove("error")
        },1000)
    }
}