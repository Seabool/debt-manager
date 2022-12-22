window.addEventListener('load', (event) => {
	let Person = class {
		constructor(name, debt, debtList) {
			this.name = name;
			this.debt = debt || 0.0;
			this.debtList = debtList || [];
		}

		calculateDebt() {
			let newDebt = 0.0;
			this.debtList.forEach((debt) => {
				newDebt += parseFloat(debt.debt);
			});
			this.debt = newDebt;
		}

		addDebt(reason, debt) {
			this.debtList.push({ debt: debt.replace(',', '.'), reason: reason, id: Date.now() });
			this.calculateDebt();
		}

		removeDebtById(id) {
			this.debtList = this.debtList.filter((e) => e.id !== id);
			this.calculateDebt();
		}

		getDebt() {
			this.calculateDebt();
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
			let personContainer = document.createElement('div');
			personContainer.classList.add('person-container');

			let inputDebtContainer = document.createElement('div');
			inputDebtContainer.classList.add('add-debt-container');

			let inputReason = document.createElement('input');
			inputReason.type = 'text';
			inputReason.id = 'debt-reason-' + person.getName();
			inputReason.placeholder = 'Reason...';

			let inputDebt = document.createElement('input');
			inputDebt.type = 'text';
			inputDebt.id = 'debt-value-' + person.getName();
			inputDebt.placeholder = 'Debt...';
			inputDebt.classList.add('add-debt-input');

			let button = document.createElement('button');
			button.innerHTML = '+';
			button.id = 'add-debt-' + person.getName();
			button.classList.add('add-debt-button');
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

			inputDebtContainer.appendChild(inputReason);
			inputDebtContainer.appendChild(inputDebt);
			inputDebtContainer.appendChild(button);

			personListDisplay.appendChild(personContainer);

			let title = document.createElement('h1');
			title.innerHTML = person.getName();
			title.classList.add('title-h1');

			let removePerson = document.createElement('button');
			removePerson.innerHTML = '✖';
			removePerson.classList.add('remove-person-button');
			removePerson.addEventListener(
				'click',
				function () {
					personList.removePerson(person.getName());
					displayPersonList();
				},
				false
			);

			title.appendChild(removePerson);

			let titleDiv = document.createElement('div');
			titleDiv.classList.add('title-container');
			titleDiv.appendChild(title);
			titleDiv.appendChild(removePerson);

			let newDiv = document.createElement('div');
			newDiv.classList.add('debts-container');

			person.getDebtList().forEach((elem) => {
				let debtContainer = document.createElement('div');
				debtContainer.classList.add('debt-container');

				let reasonElem = document.createElement('div');
				reasonElem.innerHTML = elem.reason;

				let debtElem = document.createElement('div');
				debtElem.innerHTML = formatCurrency(parseFloat(elem.debt));
				debtElem.classList.add('debt-value-container');

				let removeDebt = document.createElement('button');
				removeDebt.innerHTML = '✖';
				removeDebt.classList.add('remove-debt-button');
				removeDebt.id = 'remove-debt-' + elem.id;

				debtContainer.appendChild(reasonElem);
				debtContainer.appendChild(debtElem);
				debtContainer.appendChild(removeDebt);

				newDiv.appendChild(debtContainer);

				removeDebt.addEventListener(
					'click',
					function () {
						person.removeDebtById(elem.id);
						displayPersonList();
					},
					false
				);
			});
			let newDiv2 = document.createElement('div');
			newDiv2.classList.add('debts-container2');

			personContainer.appendChild(titleDiv);
			personContainer.appendChild(inputDebtContainer);
			personContainer.appendChild(newDiv);
			personContainer.appendChild(newDiv2);

			let reasonElem = document.createElement('div');
			reasonElem.innerHTML = 'Total:';

			let debtElem = document.createElement('div');
			debtElem.innerHTML = formatCurrency(person.getDebt());

			newDiv2.appendChild(reasonElem);
			newDiv2.appendChild(debtElem);
		});

		localStorage.setItem('personList', JSON.stringify(personList));
	};

	document.getElementById('add-person-button').addEventListener(
		'click',
		function () {
			let personNameInput = document.getElementById('person-name');
			personList.addPerson(new Person(personNameInput.value));
			personNameInput.value = '';
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
