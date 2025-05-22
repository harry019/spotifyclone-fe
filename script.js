document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    // UI Elements
    const songItems = document.querySelectorAll(".song-item");
    console.log("Found song items:", songItems.length);

    const audioPlayer = new Audio();
    const songInfoDiv = document.querySelector(".songinfo");
    const seekBar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    const progressBar = document.querySelector(".seekbar .progress");
    const volumeControl = document.querySelector(".volume-control");
    const playPauseButton = document.getElementById("playPauseButton");
    const forwardButton = document.querySelector(".forward");
    const previousButton = document.querySelector(".previous");
    const shuffleButton = document.querySelector(".shuffle");
    const loopButton = document.querySelector(".loop");
    const songTimeDiv = document.querySelector(".songtime");
    const albumPlayButton = document.querySelector(".album-play-button");

    // Song data with exact paths matching your folder structure
    const songs = {
        "Millionaire": "./songs/Millionaire.mp3",
        "Jatt Mehkma": "./songs/Jatt Mehkma - Glory 128 Kbps.mp3",
        "High On Me": "./songs/High On Me - Glory 128 Kbps.mp3",
        "Fuck Them": "./songs/Fuck Them - Glory 128 Kbps.mp3",
        "Bonita": "./songs/Bonita - Glory 128 Kbps.mp3",
        "Payal": "./songs/Payal - Glory 320 Kbps.mp3"
    };

    // Play/pause state
    let isPlaying = false;
    let currentSongIndex = -1;
    let isLooping = false;

    // Initialize player
    function initPlayer() {
        // Set initial volume
        audioPlayer.volume = volumeControl.value / 100;

        // Setup empty time display
        if (songTimeDiv) {
            songTimeDiv.textContent = "0:00 / 0:00";
        }
    }

    // Add click event listeners to song items
    songItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const songTitleElement = item.querySelector(".song-title");
            if (songTitleElement) {
                const songTitle = songTitleElement.textContent.trim();
                playSong(songTitle, index);
            }
        });
    });

    // Album play button functionality
    if (albumPlayButton) {
        albumPlayButton.addEventListener("click", () => {
            // Play first song or resume current
            if (currentSongIndex === -1) {
                songItems[0].click();
            } else {
                togglePlayPause();
            }
        });
    }

    // Play a specific song
    function playSong(songName, index) {
        if (songs[songName]) {
            const songPath = songs[songName];
            console.log("Playing song:", songName, "Path:", songPath);

            try {
                // Only change source if it's a different song
                if (!audioPlayer.src.endsWith(encodeURIComponent(songPath.replace('./', '')))) {
                    audioPlayer.src = songPath;
                    audioPlayer.load(); // Important for some browsers
                }

                // Play the song
                const playPromise = audioPlayer.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                        updatePlayPauseButton();
                        updateSongInfo(songName);

                        // Update active song indicator
                        songItems.forEach((item, i) => {
                            if (i === index) {
                                item.classList.add("active");
                            } else {
                                item.classList.remove("active");
                            }
                        });

                        currentSongIndex = index;
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                        alert("Couldn't play the song. Make sure the audio file exists and the path is correct.");
                    });
                }
            } catch (error) {
                console.error("Audio playback error:", error);
                alert("Audio playback error. Please check if the audio files exist in the specified location.");
            }
        } else {
            console.error("Song not found in the songs list:", songName);
        }
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play().catch(error => {
                console.error("Play error:", error);
            });
        }

        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    // Update play/pause button icon
    function updatePlayPauseButton() {
        if (playPauseButton) {
            playPauseButton.src = isPlaying ? "Pictures_and_logos/pause.svg" : "Pictures_and_logos/play.svg";
        }
    }

    // Play/Pause button click event
    if (playPauseButton) {
        playPauseButton.addEventListener("click", togglePlayPause);
    }

    // Forward button functionality
    if (forwardButton) {
        forwardButton.addEventListener("click", () => {
            if (currentSongIndex !== -1) {
                const nextIndex = (currentSongIndex + 1) % songItems.length;
                songItems[nextIndex].click();
            } else if (songItems.length > 0) {
                // If no song is playing, play the first one
                songItems[0].click();
            }
        });
    }

    // Previous button functionality
    if (previousButton) {
        previousButton.addEventListener("click", () => {
            if (currentSongIndex !== -1) {
                const prevIndex = (currentSongIndex - 1 + songItems.length) % songItems.length;
                songItems[prevIndex].click();
            } else if (songItems.length > 0) {
                // If no song is playing, play the first one
                songItems[0].click();
            }
        });
    }

    // Shuffle button functionality
    if (shuffleButton) {
        shuffleButton.addEventListener("click", () => {
            if (songItems.length > 0) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * songItems.length);
                } while (randomIndex === currentSongIndex && songItems.length > 1);

                songItems[randomIndex].click();
            }
        });
    }

    // Loop button functionality
    if (loopButton) {
        loopButton.addEventListener("click", () => {
            isLooping = !isLooping;
            audioPlayer.loop = isLooping;
            loopButton.classList.toggle("active", isLooping);
        });
    }

    // Function to update the song info
    function updateSongInfo(songName) {
        if (songInfoDiv) {
            songInfoDiv.innerHTML = `<span class="song-title">Now Playing: ${songName}</span>`;
        }
    }

    // Seekbar functionality
    audioPlayer.addEventListener("timeupdate", () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            updateProgressBar(progress);
            updateSongTime();
        }
    });

    if (seekBar) {
        seekBar.addEventListener("click", (event) => {
            const rect = seekBar.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const seekPosition = offsetX / seekBar.offsetWidth;

            if (!isNaN(audioPlayer.duration)) {
                audioPlayer.currentTime = seekPosition * audioPlayer.duration;
            }
        });
    }

    function updateProgressBar(progress) {
        if (progressBar && circle) {
            progressBar.style.width = `${progress}%`;
            circle.style.left = `${progress}%`;
        }
    }

    function updateSongTime() {
        if (songTimeDiv) {
            const currentTime = formatTime(audioPlayer.currentTime);
            const duration = formatTime(audioPlayer.duration);
            songTimeDiv.textContent = `${currentTime} / ${duration}`;
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    }

    // Volume control
    if (volumeControl) {
        volumeControl.addEventListener("input", (event) => {
            audioPlayer.volume = event.target.value / 100;
        });
    }

    // Handle song ending
    audioPlayer.addEventListener("ended", () => {
        if (!isLooping && currentSongIndex !== -1) {
            // Auto play next song when current one ends
            const nextIndex = (currentSongIndex + 1) % songItems.length;
            songItems[nextIndex].click();
        }
    });

    // Error handling for audio loading
    audioPlayer.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        alert("Error loading audio file. Please check if the file exists and the path is correct.");
    });

    // Initialize the player
    initPlayer();

});

document.querySelector('.hamburger_menu').addEventListener('click', function () {
    document.querySelector('.left').classList.toggle('active');
});

let cross = document.getElementById("cross")
let pop = document.getElementById("pop")
cross.addEventListener("click", () => {
    pop.style.display = "none"
})