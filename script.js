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
			this.debtList.push({ debt: debt, reason: reason, id: Date.now() });
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
			let div = document.createElement('div');
			div.classList.add('person-container');
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
			divInner.innerText = 'Debt: ';
			personListDisplay.appendChild(div);
			let title = document.createElement('h1');
			title.innerHTML = person.getName();
			let removePerson = document.createElement('button');
			removePerson.innerHTML = 'Remove person';
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
			titleDiv.appendChild(title);
			titleDiv.appendChild(removePerson);
			div.appendChild(titleDiv);
			div.appendChild(inputReason);
			div.appendChild(inputDebt);
			div.appendChild(button);
			div.appendChild(divInner);
			let newDiv = document.createElement('div');
			newDiv.classList.add('debts-container');
			div.appendChild(newDiv);
			person.getDebtList().forEach((elem) => {
				let debtElem = document.createElement('div');
				debtElem.innerHTML = formatCurrency(parseFloat(elem.debt));
				newDiv.appendChild(debtElem);
				let reasonElem = document.createElement('div');
				reasonElem.innerHTML = elem.reason;
				newDiv.appendChild(reasonElem);
				let removeDebt = document.createElement('button');
				removeDebt.innerHTML = 'Remove';
				removeDebt.id = 'remove-debt-' + elem.id;
				newDiv.appendChild(removeDebt);
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
			div.appendChild(newDiv2);
			let debtElem = document.createElement('div');
			debtElem.innerHTML = formatCurrency(parseFloat(person.getDebt()));
			newDiv2.appendChild(debtElem);
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
