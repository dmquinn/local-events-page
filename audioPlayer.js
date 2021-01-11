module.exports = function audioPlay() {
	function $(id) {
		return document.getElementById(id);
	}
	const media = document.body.getElementById("audio");

	let ui = {
		play: "playAudio",
		audio: "audio",
		percentage: "percentage",
		seekObj: "seekObj",
		currentTime: "currentTime",
	};
	var playPause = document.querySelector("#playAudio");
	function togglePlay() {
		if (media.paused === false) {
			media.pause();
			playPause.style.backgroundImage = "url('play.svg')";
			$(ui.play).classList.remove("pause");
		} else {
			media.play();
			playPause.style.backgroundImage = "url('pause.svg')";
			$(ui.play).classList.add("pause");
		}
	}

	function calculatePercentPlayed() {
		let percentage = (media.currentTime / media.duration).toFixed(2) * 100;
		$(ui.percentage).style.width = `${percentage}%`;
	}

	function calculateCurrentValue(currentTime) {
		const currentMinute = parseInt(currentTime / 60) % 60;
		const currentSecondsLong = currentTime % 60;
		const currentSeconds = currentSecondsLong.toFixed();
		const currentTimeFormatted = `${
			currentMinute < 10 ? `0${currentMinute}` : currentMinute
		}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;

		return currentTimeFormatted;
	}

	function initProgressBar() {
		const currentTime = calculateCurrentValue(media.currentTime);
		$(ui.currentTime).innerHTML = currentTime;
		$(ui.seekObj).addEventListener("click", seek);

		media.onended = () => {
			$(ui.play).classList.remove("pause");
			$(ui.percentage).style.width = 0;
			$(ui.currentTime).innerHTML = "00:00";
		};

		function seek(e) {
			const percent = e.offsetX / this.offsetWidth;
			media.currentTime = percent * media.duration;
		}

		calculatePercentPlayed();
	}

	$(ui.play).addEventListener("click", togglePlay);
	$(ui.audio).addEventListener("timeupdate", initProgressBar);

	window.onload = function () {
		var file = document.getElementById("thefile1");
		var audio = document.getElementById("audio");

		file.onchange = function () {
			var files = this.files;
			audio.src = URL.createObjectURL(files[0]);
			uploadedFiles.push(files[0]);
			console.log("array data", uploadedFiles);
			var fileName = document.querySelector(".fileName");
			fileName.innerHTML = file.name;

			var context = new AudioContext();
			var src = context.createMediaElementSource(audio);

			var analyser = context.createAnalyser();
			var canvas = document.getElementById("canvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			var ctx = canvas.getContext("2d");
			src.connect(analyser);
			analyser.connect(context.destination);

			analyser.fftSize = 256;

			var bufferLength = analyser.frequencyBinCount;

			var dataArray = new Uint8Array(bufferLength);

			var WIDTH = canvas.width;
			var HEIGHT = canvas.height;

			var barWidth = (WIDTH / bufferLength) * 2.5;
			var barHeight;
			var x = 0;

			function renderFrame() {
				requestAnimationFrame(renderFrame);

				x = 0;

				analyser.getByteFrequencyData(dataArray);

				ctx.fillStyle = "#000";
				ctx.fillRect(0, 0, WIDTH, HEIGHT);

				for (var i = 0; i < bufferLength; i++) {
					barHeight = dataArray[i];

					var r = barHeight + 1 * (i / bufferLength);
					var g = 250 * (i / bufferLength);
					var b = 50;

					ctx.fillStyle = "white";
					ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

					x += barWidth - 10;
				}
			}

			audio.play();
			renderFrame();
		};
	};
};
