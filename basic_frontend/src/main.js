

function createVideoSidebarItem(filename, size){
    list = document.getElementById('scrollable');
    temp = document.createElement('div')
    temp.className  = 'videoItem';
    img = document.createElement('img');
    img.src = 'static/icon-park-outline_video.png';
    img.className  = 'sidebarVideoIcon';
    console.log(img);
    temp.appendChild(img)
    title = document.createElement('div');
    title.innerText = filename;
    title.className  = 'sidebarVideoTitle';
    console.log(title);
    temp.appendChild(title);
    filesize = document.createElement('div');
    filesize.className  = 'fileSize';
    filesize.innerText = size;
    console.log(filesize);
    temp.appendChild(filesize);
    list.appendChild(temp);
}
console.log('aaaaaa');

createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');
createVideoSidebarItem('TEST', 'TEST');