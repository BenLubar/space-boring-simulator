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

	var originalProtagonistName = document.getElementById('intro-text-0000-name').value;

	function updateGame(game) {
		switch (game['v']) {
		case 0:
			game['protagonist-name'] = originalProtagonistName;
			game['dialog'] = 'intro-text-0000';
			game['gsac-number'] = Math.floor(Math.random() * 1990 + 10);
			// This generates a random 39 digit space credit card number. No Earth credit card number is more than 20 digits. (2015-06-22)
			var creditcard = '';
			for (var i = 0; i < 9; i++) {
				for (var j = 0; j < 4; j++) {
					creditcard += Math.floor(Math.random() * 10);
				}
				creditcard += '-';
			}
			for (var i = 0; i < 3; i++) {
				creditcard += Math.floor(Math.random() * 10);
			}
			game['space-credit-card'] = creditcard;
			game['space-credits'] = 350;
			game['enabled-ui-elements'] = {'menu-bar-save': true};
			game['v'] = 1;
		}
		return game;
	}

	function startGame(game) {
		game = updateGame(game);
		function updateCredits() {
			var credits = Math.floor(game['space-credits'] / 100) + '.' + ('0' + game['space-credits'] % 100).substr(-2);
			Array.prototype.forEach.call(document.querySelectorAll('.space-credits'), function(el) {
				el.textContent = credits;
			});
		}
		updateCredits();
		document.getElementById('main-menu').classList.remove(ACTIVE_CLASS);
		document.getElementById('title').classList.remove(ACTIVE_CLASS);
		document.getElementById('menu-bar').classList.add(ACTIVE_CLASS);
		Array.prototype.forEach.call(document.querySelectorAll('#menu-bar .active'), function(el) {
			el.classList.remove(ACTIVE_CLASS);
		});
		document.getElementById('menu-bar-save').addEventListener('click', function() {
			document.getElementById('save-dialog').classList.toggle(ACTIVE_CLASS);
			document.getElementById('save-dialog-name').focus();
		}, false);
		document.getElementById('menu-bar-space-credit-card').addEventListener('click', function() {
			document.getElementById('space-credit-card-dialog').classList.toggle(ACTIVE_CLASS);
		}, false);
		document.getElementById('save-dialog-button').addEventListener('click', function() {
			savedData[SAVES_KEY][document.getElementById('save-dialog-name').value] = JSON.parse(JSON.stringify(game));
			saveData();
			document.getElementById('save-dialog').classList.remove(ACTIVE_CLASS);
		}, false);
		document.getElementById('intro-text-0000-name').value = game['protagonist-name'];
		Array.prototype.forEach.call(document.querySelectorAll('.protagonist-name'), function(el) {
			el.textContent = game['protagonist-name'];
		});
		var year = new Date().getFullYear();
		Array.prototype.forEach.call(document.querySelectorAll('.year'), function(el) {
			el.textContent = year + parseInt(el.getAttribute('data-offset'), 10);
		});
		Array.prototype.forEach.call(document.querySelectorAll('.gsac-number'), function(el) {
			el.textContent = game['gsac-number'];
		});
		Array.prototype.forEach.call(document.querySelectorAll('.space-credit-card-number'), function(el) {
			el.textContent = game['space-credit-card'];
		});
		document.getElementById('intro-text-0000-name').addEventListener('input', function() {
			var value = document.getElementById('intro-text-0000-name').value;
			game['protagonist-name'] = value;
			Array.prototype.forEach.call(document.querySelectorAll('.protagonist-name'), function(el) {
				el.textContent = value;
			});
		}, false);
		if ('dialog' in game) {
			document.getElementById(game['dialog']).classList.add(ACTIVE_CLASS);
		}
		Array.prototype.forEach.call(document.querySelectorAll('.dialog-button'), function(el) {
			el.addEventListener('click', function() {
				if (game['dialog']) {
					document.getElementById(game['dialog']).classList.remove(ACTIVE_CLASS);
				}
				var dialog = el.getAttribute('data-dialog');
				if (dialog) {
					document.getElementById(dialog).classList.add(ACTIVE_CLASS);
					game['dialog'] = dialog;
				} else {
					delete game['dialog'];
				}
			}, false);
		});
		for (var id in game['enabled-ui-elements']) {
			document.getElementById(id).classList.add(ACTIVE_CLASS);
		}
		Array.prototype.forEach.call(document.querySelectorAll('.activate-ui-element-button'), function(el) {
			el.addEventListener('click', function() {
				game['enabled-ui-elements'][el.getAttribute('data-element')] = true;
				document.getElementById(el.getAttribute('data-element')).classList.add(ACTIVE_CLASS);
			}, false);
		});
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
					startGame(JSON.parse(JSON.stringify(game)));
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
	applicationCache.addEventListener('error', function() {
		resetLoadingStatus();
		initializeAttractScreen();
		document.getElementById('attract-screen').classList.add('error');
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
