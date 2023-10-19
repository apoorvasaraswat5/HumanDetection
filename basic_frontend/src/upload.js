recentButton = document.getElementById('recent');
uploadButton = document.getElementById('upload');
recentButton.onclick = function () {
    this.className = 'active';
    uploadButton.className = '';
};
uploadButton.onclick = function () {
    this.className = 'active';
    recentButton.className = '';
};