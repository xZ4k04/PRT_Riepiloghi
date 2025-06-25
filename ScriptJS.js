// Variabile globale per memorizzare i dati JSON
let jsonData = null;
let fileRowCounter = 0;

// Funzione per aggiungere una nuova riga alla tabella dei file
function addFileRow() {
	fileRowCounter++;
	const tbody = document.getElementById('filesTableBody');
	const row = document.createElement('tr');
	row.innerHTML = `
		<td><input type="text" name="componente_${fileRowCounter}" placeholder="Es. Lettera"></td>
		<td><input type="text" name="file_${fileRowCounter}" placeholder="Es. documento.pdf"></td>
		<td>
			<input type="text" name="formato_${fileRowCounter}" placeholder="445X304.8"></td>
		</td>
		<td><input type="text" name="carta_${fileRowCounter}" placeholder="EVO PLUS 45"></td>
		<td>
			<input type="text" name="tipoStampa_${fileRowCounter}" placeholder="FULL COLOR"></td>
		</td>
		<td>
			<select name="perforazioni_${fileRowCounter}">
				<option value="">Seleziona...</option>
				<option value="Si">Sì</option>
				<option value="No">No</option>
			</select>
		</td>
		<td><input type="number" name="quantitaIndirizzi_${fileRowCounter}" placeholder="1000" min="0"></td>
		<td><input type="number" name="quantitaPagPdf_${fileRowCounter}" placeholder="5" min="0"></td>
		<td><button type="button" class="btn-remove" onclick="removeFileRow(this)">🗑️</button></td>
	`;
	tbody.appendChild(row);
}

// Funzione per rimuovere una riga dalla tabella
function removeFileRow(button) {
	const row = button.closest('tr');
	row.remove();
}

// Funzione per raccogliere i dati dalla tabella dei file
function collectFileData() {
	const files = [];
	const tbody = document.getElementById('filesTableBody');
	const rows = tbody.querySelectorAll('tr');

	rows.forEach((row, index) => {
		const inputs = row.querySelectorAll('input, select');
		if (inputs.length > 0) {
			const fileData = {
				componente: inputs[0].value,
				file: inputs[1].value,
				formato: inputs[2].value,
				carta: inputs[3].value,
				tipoStampa: inputs[4].value,
				perforazioni: inputs[5].value,
				quantitaIndirizzi: parseInt(inputs[6].value) || 0,
				quantitaPagPdf: parseInt(inputs[7].value) || 0
			};
			
			// Aggiungi solo se almeno un campo è compilato
			if (Object.values(fileData).some(value => value !== '' && value !== 0)) {
				files.push(fileData);
			}
		}
	});

	return files;
}

// Funzione per raccogliere i dati dal form
function collectFormData() {
	const formData = {
		repartoDigitaleCoinvolto: document.getElementById('repartoDigitale').value,
		nCommessaMadre: document.getElementById('nCommessaMadre').value,
		nCommessa: document.getElementById('nCommessa').value,
		cliente: document.getElementById('cliente').value,
		nomeCommessa: document.getElementById('nomeCommessa').value,
		TotaleIndirizzi: document.getElementById('TotaleIndirizzi').value,
		provaImbusto: document.getElementById('provaImbusto').value,
		cartaConFori: document.getElementById('cartaConFori').value,
		filePath: document.getElementById('filePath').value,
		descrizioneFlusso: document.getElementById('descrizioneFlusso').value,
		infoAggiuntive: document.getElementById('infoAggiuntive').value,
		files: collectFileData(),
		dataOperatore: document.getElementById('dataOperatore').value,
		imbustamentoCuraDi: document.getElementById('imbustamentoCuraDi').value,
		tipoScatole: document.getElementById('tipoScatole').value,
		numeroScatole: document.getElementById('numeroScatole').value,
		consegnaInPosta: document.getElementById('consegnaInPosta').value,
		luogoConsegnaInPosta: document.getElementById('luogoConsegnaInPosta').value,
		dataGenerazione: new Date().toLocaleString('it-IT')
	};

	return formData;
}

// Funzione per generare e mostrare il JSON
function generateJSON() {
	jsonData = collectFormData();
	
	// Mostra l'anteprima JSON
	const jsonPreview = document.getElementById('jsonPreview');
	const jsonString = JSON.stringify(jsonData, null, 2);
	jsonPreview.textContent = jsonString;
	jsonPreview.style.display = 'block';

	// Mostra il messaggio di successo
	const successMessage = document.getElementById('successMessage');
	successMessage.style.display = 'block';
	
	// Nascondi il messaggio dopo 3 secondi
	setTimeout(() => {
		successMessage.style.display = 'none';
	}, 3000);

	// Abilita il pulsante di download
	document.getElementById('downloadBtn').disabled = false;
}

// Funzione per scaricare il file JSON
function downloadJSON() {
	if (!jsonData) {
		alert('Prima devi generare il JSON!');
		return;
	}

	const jsonString = JSON.stringify(jsonData, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement('a');
	a.href = url;
	a.download = `riepilogo_${jsonData.nCommessaMadre || 'documento'}_${jsonData.nCommessa}_${jsonData.cliente}_${new Date().toISOString().slice(0, 10)}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById('addFileBtn').addEventListener('click', addFileRow);
document.getElementById('generateBtn').addEventListener('click', generateJSON);
document.getElementById('downloadBtn').addEventListener('click', downloadJSON);

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
	// Disabilita il pulsante di download all'inizio
	document.getElementById('downloadBtn').disabled = true;
	
	// Imposta la data corrente nel campo data e operatore
	const now = new Date();
	const dateString = now.toLocaleDateString('it-IT');
	document.getElementById('dataOperatore').placeholder = `Es. ${dateString} - Il tuo nome`;

	// Aggiungi una riga iniziale alla tabella
	addFileRow();
});

// Funzione per validare i campi obbligatori (opzionale)
function validateForm() {
	const requiredFields = ['cliente', 'nomeCommessa'];
	let isValid = true;

	requiredFields.forEach(fieldId => {
		const field = document.getElementById(fieldId);
		if (!field.value.trim()) {
			field.style.borderColor = '#f5576c';
			isValid = false;
		} else {
			field.style.borderColor = '#e1e5e9';
		}
	});

	return isValid;
}