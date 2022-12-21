window.addEventListener('load', (event) => {
	let Person = class {
		constructor(name, debt, debtList) {
			this.name = name;
			this.debt = debt || 0.0;
			this.debtList = debtList || [];
		}

		addDebt(reason, debt) {
			this.debt += parseFloat(debt);
			this.debtList.push({ debt: debt, reason: reason });
		}

		getDebt() {
			return formatCurrency(this.debt);
		}

		getDebtList() {
			return this.debtList;
		}

		getName() {
			return this.name;
		}
	};

	let PersonList = class {
		constructor() {
			this.persons = [];
		}

		addPerson(person) {
			this.persons.push(person);
		}

		removePerson(name) {
			this.persons = this.persons.filter((e) => e.getName() !== name);
		}

		findPerson(name) {
			this.persons.forEach((person) => {
				if (person.getName() === name) return person;
			});
		}

		getPersons() {
			return this.persons;
		}
	};

	let formatCurrency = function (money) {
		return money.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
	};

	let displayPersonList = function () {
		const personListDisplay = document.getElementById('person-list');
		personListDisplay.innerHTML = '';
		personList.getPersons().forEach((person) => {
			let div = document.createElement('div');
			let inputReason = document.createElement('input');
			inputReason.type = 'text';
			inputReason.id = 'debt-reason-' + person.getName();
			inputReason.placeholder = 'Reason...';
			let inputDebt = document.createElement('input');
			inputDebt.type = 'text';
			inputDebt.id = 'debt-value-' + person.getName();
			inputDebt.placeholder = 'Debt...';
			let button = document.createElement('button');
			button.innerHTML = 'Add debt';
			button.id = 'add-debt-' + person.getName();
			button.addEventListener(
				'click',
				function () {
					const debtValue = document.getElementById('debt-value-' + person.getName()).value;
					const debtReason = document.getElementById('debt-reason-' + person.getName()).value;

					person.addDebt(debtReason, debtValue);
					displayPersonList();
				},
				false
			);
			let divInner = document.createElement('h2');
			divInner.innerText = 'Debt: ' + person.getDebt();
			personListDisplay.appendChild(div);
			let title = document.createElement('h1');
			title.innerHTML = person.getName();
			let hr = document.createElement('hr');
			div.appendChild(title);
			div.appendChild(divInner);
			div.appendChild(inputReason);
			div.appendChild(inputDebt);
			div.appendChild(button);
			person.getDebtList().forEach((elem) => {
				let debtElem = document.createElement('h3');
				debtElem.innerHTML = elem.reason + ' | ' + formatCurrency(parseFloat(elem.debt));
				div.appendChild(debtElem);
			});
			div.appendChild(hr);
		});
		localStorage.setItem('personList', JSON.stringify(personList));
	};

	document.getElementById('add-person-button').addEventListener(
		'click',
		function () {
			const personName = document.getElementById('person-name').value;
			personList.addPerson(new Person(personName));
			displayPersonList();
		},
		false
	);

	document.getElementById('remove-person-button').addEventListener(
		'click',
		function () {
			const personName = document.getElementById('person-name').value;

			personList.removePerson(personName);
			displayPersonList();
		},
		false
	);

	let personList = new PersonList();
	var retrievedObject = localStorage.getItem('personList');
	if (retrievedObject != null) {
		let personsToPush = JSON.parse(retrievedObject).persons;
		personsToPush.forEach((elem) => {
			personList.addPerson(new Person(elem.name, elem.debt, elem.debtList));
		});
		displayPersonList();
	}
});