function getMusicList(callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'js/music.json', true)
    xhr.onload = function() {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status ===304) {
            callback(JSON.parse(this.responseText))
        }else {
            console.log('获取数据失败')
        }
    } 
    xhr.onerror = function() {
        console.log('网络异常')
    }
    xhr.send()
}

function loadMusic(musicObj) {
    audio.src = musicObj.src
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .auther').innerText = musicObj.auther
    $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
}

function setPlaylist(musiclist) {
    var container = document.createDocumentFragment()
    musiclist.forEach(function(musicObj){
        var node = document.createElement('li')
        node.innerText = musicObj.auther + '-' + musicObj.title
        container.appendChild(node)
    })
    $('.musicbox .list').appendChild(container)
}

function $(selector) {
    return document.querySelector(selector)
}

var currentIndex = 0
var clock
var musicList = []
var audio = new Audio()
audio.autoplay = true
audio.ontimeupdate = function() {
    $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
}
getMusicList(function(list){
    musicList = list
    setPlaylist(list)
    loadMusic(list[currentIndex])
})

audio.onplay = function() {
    clock = setInterval(function(){
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60 + ''
        sec = sec.length ===2 ? sec : '0' + sec
        $('.musicbox .time').innerText = min + ':' +sec
    }, 1000)
}

audio.onpause = function(){
    clearInterval(clock)
}

$('.musicbox .play').onclick = function(){
    if(audio.paused){
        audio.play()
        this.querySelector('.iconfont').classList.remove('icon-play')
        this.querySelector('.iconfont').classList.add('icon-pause')
    }else {
        audio.pause()
        this.querySelector('.iconfont').classList.remove('icon-pause')
        this.querySelector('.iconfont').classList.add('icon-play')
    }
}

$('.musicbox .forward').onclick = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .back').onclick = function(){
    currentIndex = ( musicList.length + --currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .bar').onclick = function(e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent
}

audio.onended = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicbox .list').onclick = function(e) {
    if(e.target.tagName.toLowerCase() === 'li') {
        for(var i = 0; i < this.children.length; i++){
            if(this.children[i] === e.target){
                currentIndex = i
            }
        }
        loadMusic(musicList[currentIndex])
    }
}