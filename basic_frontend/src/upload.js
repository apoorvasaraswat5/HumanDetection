recentButton = document.getElementById('recent');
uploadButton = document.getElementById('upload');
showRecent();
recentButton.onclick = function () {
    this.className = 'active';
    uploadButton.className = '';
    showRecent();
};
uploadButton.onclick = function () {
    this.className = 'active';
    recentButton.className = '';
    document.getElementById('recentlist').innerHTML='';
};

function showRecent() {
    getRecent().sort((a,b) =>{
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).forEach(recent => {
        addRecent(recent.name, recent.date, recent.size, 'static/icon-park-outline_video.png');
    });
}

function addRecent(name,date,size,img) {
    tempItem = document.createElement('div');
    tempItem.className = 'fileitem';
    tempImg = document.createElement('img');
    tempImg.src = img;
    tempImg.className = 'fileimg';
    tempItem.appendChild(tempImg);
    tempName = document.createElement('div');
    tempName.className = 'filename';
    tempName.innerText = name;
    tempItem.appendChild(tempName);
    tempDate = document.createElement('div');
    tempDate.className = 'filedate';
    tempDate.innerText = date;
    tempItem.appendChild(tempDate);
    tempSize = document.createElement('div');
    tempSize.className = 'filesize';
    tempSize.innerText = size+' GB';
    tempItem.appendChild(tempSize);
    document.getElementById('recentlist').appendChild(tempItem);
}

function getRecent() {
    // TODO
    // Temp values currently 
    tempValues = [
        {"name":"MaurisLaoreet.mp3","date":"11/03/2022","size":11.4},
        {"name":"MontesNasceturRidiculus.mp3","date":"07/30/2023","size":21.7},
        {"name":"Vel.ppt","date":"09/27/2023","size":32.2},
        {"name":"PenatibusEt.mp3","date":"07/29/2023","size":8.0},
        {"name":"NecSed.jpeg","date":"11/14/2022","size":20.7},
        {"name":"VenenatisNon.xls","date":"03/27/2023","size":0.9},
        {"name":"SuscipitA.avi","date":"09/26/2023","size":9.7},
        {"name":"QuamPedeLobortis.ppt","date":"02/05/2023","size":13.1},
        {"name":"VulputateVitae.xls","date":"04/05/2023","size":5.7},
        {"name":"ErosViverra.tiff","date":"01/25/2023","size":15.6},
        {"name":"VitaeNislAenean.xls","date":"12/26/2022","size":22.6},
        {"name":"EuOrci.gif","date":"12/14/2022","size":13.7},
        {"name":"AcNulla.jpeg","date":"04/02/2023","size":3.4},
        {"name":"ArcuSedAugue.mov","date":"07/08/2023","size":12.3},
        {"name":"LacusMorbi.mp3","date":"04/29/2023","size":31.6},
        {"name":"EuTincidunt.ppt","date":"10/06/2023","size":16.9},
        {"name":"Cras.avi","date":"09/05/2023","size":16.9},
        {"name":"Id.png","date":"09/01/2023","size":30.0},
        {"name":"Pellentesque.mp3","date":"10/28/2022","size":33.1},
        {"name":"Sapien.mov","date":"09/01/2023","size":12.1},
        {"name":"Faucibus.png","date":"11/09/2022","size":30.5},
        {"name":"Praesent.xls","date":"11/27/2022","size":33.3},
        {"name":"OdioDonecVitae.ppt","date":"10/01/2023","size":14.5},
        {"name":"NecCondimentum.avi","date":"01/15/2023","size":7.9},
        {"name":"JustoIn.avi","date":"01/24/2023","size":3.4}
    ];
    return tempValues;
}

function sendFiles(files){
    console.log(files);
}

let dropArea = document.getElementById('droparea');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        dropArea.className = 'highlight';
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) =>{
        dropArea.className = '';
    }, false)
});