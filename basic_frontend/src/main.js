function createVideoSidebarItem(filename, size){
    list = document.getElementById('scrollable');
    temp = document.createElement('div')
    temp.className  = 'videoItem';
    temp.onclick = function(){
        selected = document.getElementsByClassName('videoItem selected');
        Array.from(selected).forEach(element => {
            element.className = 'videoItem';
        });
        this.className = 'videoItem selected';
    };
    img = document.createElement('img');
    img.src = 'static/icon-park-outline_video.png';
    img.className  = 'sidebarVideoIcon';
    temp.appendChild(img);
    title = document.createElement('div');
    title.innerText = filename;
    title.className  = 'sidebarVideoTitle';
    temp.appendChild(title);
    filesize = document.createElement('div');
    filesize.className  = 'fileSize';
    filesize.innerText = size;
    temp.appendChild(filesize);
    list.appendChild(temp);
}

createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');