function change(){
    var dist = document.getElementById("distribution").value;
    if (dist == "pdf"){
        location.href="./moment_PDF.html";
    }
    else if (dist == "pmf"){
        location.href="./moment_PMF.html";
    }
}