document.addEventListener('DOMContentLoaded', () => {

  let audio = document.querySelector('#audio'),
      title = document.querySelector('.audio-title'),
      playOrPause = document.querySelector('.play-pause'),
      progress = document.querySelector('#progress'),
      speed = document.querySelectorAll('.typeSpeed p'),
      volume = document.querySelector('#volume'),
      currentTime = document.querySelector('#currentTime'),
      durationTime = document.querySelector('#durationTime'),
      openList = document.querySelector('.open-playlist'),
      uploadMusic = document.querySelector('#upload-music'),
      downloadMusic = document.querySelector('.download');

  // All of songs that located and we can get in localStorage
  const songs = JSON.parse(localStorage.getItem('allSongs')) || [
    {name: 'devil-eyes-hippie-sabotage.mp3', path: "./songs/"},
    {name: 'all-night-mishlawi.mp3', path: "./songs/"},
    {name: 'all-the-way-up-fat-joe-ft.mp3', path: "./songs/"},
    {name: 'billy-6ix9ine.mp3', path: "./songs/"},
  ];

  // get songs in localStorage
  const toSongs = () => {
    localStorage.setItem('allSongs', JSON.stringify(songs));
  }

  // Array Enumeration "songs" in playlist
  songs.map((elem, i) => {
    let songList = document.querySelector('.song-list');
    songList.innerHTML += `<div id="list">
      ${i+1}. <span>${elem.name}</span>
      <p>${elem.path}</p>
    </div>`;
  })

  // When we press on one of songs from playlist and that song plays
  const changeSong = (song, path) => {
    title.textContent = song;
    audio.src = path + song;

    console.log(audio.src)

    if(audio.paused){
      audio.play();
      document.querySelector('#pause').style.display = 'block';
      document.querySelector('#play').style.display = 'none';
    }
  }

  let musicList = document.querySelectorAll('.song-list #list');

  // Enumeration of songs from "musicList" then we send them function changeSong()
  musicList.forEach(elem => {
    let song = elem.querySelector('span');
    let path = elem.querySelector('p');

    audio.src = songs[0].path + songs[0].name;
    title.textContent = songs[0].name;

    elem.onclick = () => {
      console.log(song.textContent)
      changeSong(song.textContent, path.textContent);
    }

  })

  // Audio play or pause
  const play = () => {
    console.log(audio.currentSrc)

    if(audio.paused){
      audio.play();
      document.querySelector('#pause').style.display = 'block';
      document.querySelector('#play').style.display = 'none';
    } else {
      audio.pause();
      document.querySelector('#pause').style.display = 'none';
      document.querySelector('#play').style.display = 'block';
    }
  }

  // Change audio duration and rewind
  const audioRewind = () => {
    let w = progress.offsetWidth;
    let x = event.offsetX;

    progress.value = (100 * x) / w;
    audio.pause();
    audio.currentTime = audio.duration * (x / w);

    if(audio.paused){
      audio.play();
      document.querySelector('#pause').style.display = 'block';
      document.querySelector('#play').style.display = 'none';
    }
  }

  // Audio change volume
  const audioVolume = () => {
    let v = volume.value;
    audio.volume = v / 100;

    if(audio.volume == 0){
      document.querySelector('#volume-off').style.display = 'block';
      document.querySelector('#volume-on').style.display = 'none';
    } else {
      document.querySelector('#volume-off').style.display = 'none';
      document.querySelector('#volume-on').style.display = 'block';
    }
  }

  // convert time
  const convertTime = secs => {
    let min = Math.floor(secs/60);
    let sec = secs % 60;

    min = (min < 10) ? '0' + min : min;
    sec = (sec < 10) ? '0' + sec : sec;

    return (min + ':' + sec);
  }

  // Audio current and duration time
  const progressUpdate = () => {
    let d = Math.round(audio.duration);
    let c = Math.round(audio.currentTime);
    progress.value = (100 * c) / d;

    progressDuration = Math.round(audio.duration - audio.currentTime);

    currentTime.textContent = convertTime(c);
    durationTime.textContent = convertTime(progressDuration);
  }

  // Change audio speed
  speed.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playbackRate = btn.dataset.speed;
    })
  })

  // Open playlist
  const openPlaylist = () => {
    let list = document.querySelector('.song-list');
    list.classList.toggle('list-active');
  }

  // upload music
  // Don't work because of Browser's security
  const upload = e => {
    let file = uploadMusic.files;

    for(let i = 0; i < uploadMusic.files.length; i++){
      let song = {name: uploadMusic.files[i].name, path: uploadMusic.value};
      songs.push(song)
    }

    toSongs();
  }

  // Function of Download song
  const downloadFile = (data, fileName = 'music.mp3', type='mp3') => {
    const a = document.createElement('a');
    a.style.display = 'none';
    audio.appendChild(a);

    a.href = window.URL.createObjectURL(
      new Blob([data], {type})
    )

    a.setAttribute('download', fileName);
    a.click();
    console.log(a)
    console.log(audio)
  }

  // Download current song
  function download() {
    downloadFile(audio.currentSrc)
  }


  playOrPause.addEventListener('click', play);
  volume.addEventListener('input', audioVolume);
  audio.addEventListener('timeupdate', progressUpdate);
  progress.addEventListener('click', audioRewind);
  openList.addEventListener('click', openPlaylist);
  uploadMusic.addEventListener('change', upload);
  downloadMusic.addEventListener('click', download);
})
