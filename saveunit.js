
document.getElementById("downloadConfirm").addEventListener("click", function(){
    downloadJSON({"units":units}, document.getElementById("fileName").value);
});

function downloadJSON(content, name){
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(content)], {type: "text/plain"}));
    a.download = name;
    a.click();
}
