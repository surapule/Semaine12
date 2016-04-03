(function() {
	
	var searchElement = document.getElementById('search'),
		results= document.getElementById('results'),
		selectedResult = -1, //Permet de savoir que resultat est sélectionné : -1 signifie "aucune selection"
		previousRequest, //On stocke notre précédente requête dans cette variable
		previousValue = searchElement.value;  // On fait de meme avec la precedente valeur
	
	
	function getResults(keywords) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', './search.php?s=' + encodeURIComponent(keywords));
		
		xhr.addEventListener('readystatechange', function() {
			if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				
				displayResults(xhr.responseText);
			}
		});
		
		xhr.send(null);
		return xhr;
	}
	
	function displayResults(response) { //Affiche les resultats d'une requete
		
		results.style.display = response.length ? 'block' : 'none'; //on cache le conteneur si on a pas de resultat
		
		if (response.length) {
			response = response.split ('|');
			var responseLen = response.length;
			results.innerHTML = ' '; // On vide les résultats
			
			for(var i = 0, div; i < responseLen; i++) {
				div = results.appendChild(document.createElement('div'));
				div.innerHTML = response[i];
				
				div.addEventListener('click', function(e) {
					chooseResult(e.target);
				});
				
			}
		}
	}
	
	function chooseResult(result) { // Choisi un des resultat d'une requete et gere tout ce qui y est attaché
	
		searchElement.value = previousValue = result.innerHTML; // On change le contenu du champ de recherche et on enregistre en tant que précédente valeur
		results.style.display = 'none'; // on cache les résultats
		result.className= ''; // On supprime l'effet focus
		selectedResult = -1; // on remet la selection a zero
		searchElement.focus(); // Si le resultat a été choisi par le biais d'un clic alors le focus est perdu, donc on le reattribut
		
	}
	
	searchElement.addEventListener('keyup', function(e) {
		var divs = results.getElementsByTagName('div');
		
		if (e.keyCode == 38 && selectedResult > -1) { // Si la touche presse est la fleche du haut
			divs[selectedResult--].className ='';
			
			if (selectedResult > -1) { // cette condition evite une modification de childNodes[-1], qui n'existe pas 
				divs[selectedResult].className = 'result_focus';
			}
		}
		else if (e.keyCode == 40 && selectedResult < divs.length -1) { // si la touche presse est fleche bas
			results.style.display = 'block'; // on affiche les résultats
			if(selectedResult > -1) { //cette condition evite une modification de childNodes[-1] qui n'existe pas
				divs[selectedResult].className = '';				
			}
			divs[++selectedResult].className = 'result_focus';
		}
		else if (e.keyCode == 13 && selectedResult > -1) { //si la touche entrée est préssé
			chooseResult(divs[selectedResult]);
		}
		else if (searchElement.value != previousValue) { // si le contenu du champ de recherche a change
			previousValue = searchElement.value;
			if (previousRequest && previousRequest.readyState < XMLHttpRequest.DONE) {
				previousRequest.abort(); // si on a toujours une requete en cours, on l'arrete
			}
			previousRequest = getResults(previousValue); // on stocke la nouvelle requete
			selectedResult = -1; // on remet la selection a zero a chaque caractere écrit
		}
	});	
})();