(function() {
	const LOCAL_STORAGE_KEY = 'space-boring-simulator';
	const ACTIVE_CLASS = 'active';
	const SAVES_KEY = 's';

	setTimeout(function() {
		document.getElementById('title').classList.add(ACTIVE_CLASS);
	}, 1);

	var savedData = {};
	if (localStorage[LOCAL_STORAGE_KEY]) {
		savedData = JSON.parse(localStorage[LOCAL_STORAGE_KEY]);
	}
	if (!(SAVES_KEY in savedData)) {
		savedData[SAVES_KEY] = {};
	}

	function saveData() {
		localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(savedData);
	}

	function newGame() {
		return {'v': 0};
	}

	function updateGame(game) {
		return game;
	}

	function startGame(game) {
		game = updateGame(game);
		document.getElementById('main-menu').classList.remove(ACTIVE_CLASS);
		document.getElementById('title').classList.remove(ACTIVE_CLASS);
		document.getElementById('menu-bar').classList.add(ACTIVE_CLASS);
		document.getElementById('menu-bar-save').addEventListener('click', function() {
			document.getElementById('save-dialog').classList.toggle(ACTIVE_CLASS);
			document.getElementById('save-dialog-name').focus();
		}, false);
		document.getElementById('save-dialog-button').addEventListener('click', function() {
			savedData[SAVES_KEY][document.getElementById('save-dialog-name').value] = game;
			saveData();
			document.getElementById('save-dialog').classList.remove(ACTIVE_CLASS);
		}, false);
		setTimeout(function() {
			document.body.removeChild(document.getElementById('title'));
		}, 2500);
	}

	function initializeMainMenu() {
		window.addEventListener('beforeunload', saveData, false);
		document.getElementById('attract-screen').classList.remove(ACTIVE_CLASS);
		document.getElementById('main-menu-new-game').addEventListener('dblclick', function() {
			document.getElementById('save-dialog-name').value = '';
			startGame(newGame());
		}, false);
		var saveSelect = document.getElementById('main-menu-save-select');
		saveSelect.innerHTML = '';
		for (var name in savedData[SAVES_KEY]) {
			var saveOption = document.createElement('option');
			saveOption.textContent = name;
			saveOption.addEventListener('dblclick', function(name, game) {
				return function() {
					document.getElementById('save-dialog-name').value = name;
					startGame(game);
				};
			}(name, savedData[SAVES_KEY][name]), false);
			saveSelect.appendChild(saveOption);
		}
		document.getElementById('main-menu').classList.add(ACTIVE_CLASS);
	}

	function initializeAttractScreen() {
		document.getElementById('attract-screen').classList.add(ACTIVE_CLASS);
		document.querySelector('#attract-screen span').addEventListener('click', function() {
			initializeMainMenu();
		}, false);
	}

	var state = null;

	function resetLoadingStatus() {
		document.getElementById('loading-status-initializing').classList.remove(ACTIVE_CLASS);
		document.getElementById('loading-status-update-ready').classList.remove(ACTIVE_CLASS);
		document.getElementById('loading-status-progress').classList.remove(ACTIVE_CLASS);
	}
	applicationCache.addEventListener('uncached', function() {
		resetLoadingStatus();
		document.getElementById('loading-status-initializing').classList.add(ACTIVE_CLASS);
	}, false);
	applicationCache.addEventListener('cached', function() {
		resetLoadingStatus();
		initializeAttractScreen();
	}, false);
	applicationCache.addEventListener('noupdate', function() {
		resetLoadingStatus();
		initializeAttractScreen();
	}, false);
	applicationCache.addEventListener('progress', function(e) {
		resetLoadingStatus();
		document.getElementById('loading-status-progress').classList.add(ACTIVE_CLASS);
		document.getElementById('loading-status-progress-num').textContent = e.loaded;
		document.getElementById('loading-status-progress-den').textContent = e.total;
	}, false);
	applicationCache.addEventListener('updateready', function() {
		resetLoadingStatus();
		document.getElementById('loading-status-update-ready').classList.add(ACTIVE_CLASS);
		location.reload();
	}, false);

	/*setTimeout(function() {
		var music = document.getElementById('music');
		music.play();
		music.controls = true;
		music.style.display = 'inline-block';
	}, 20000);*/
})();
