//Испольуется fake api, предложенный в тестовом задании

//Функция, которая создаёт список элементов
const createList = async () => {
	//Ссылка на fake api и дефолтное значение для вывода элементов
	const url = 'https://dummyjson.com/products'
	let limit = 10

	//Получение элементов с сервера
	const response = await fetch(url)
	const data = await response.json()
	let products = data.products

	//Дефолтное отображение списка элементов
	showList(limit, products)

	//Добавление возможности перетаскивания элементов внутри списка
	addDragAndDrop()

	//Выбор количества элементов, отображаемых в списке
	const selectCount = document.querySelector('.selectCount')
	selectCount.addEventListener('change', evt => {
		const listItems = document.querySelectorAll('.list__item')

		//Очищение списка
		listItems.forEach(item => {
			item.remove()
		})

		limit = evt.target.value

		//Создание нового списка
		showList(limit, products)
		addDragAndDrop()
	})

	//3 вида соритровки массива, полученного с сервер (по умолчанию, по цене, по названию)
	const selectSort = document.querySelector('.selectSort')
	selectSort.addEventListener('change', evt => {
		const listItems = document.querySelectorAll('.list__item')
		const sortBy = evt.target.value

		//Очищение списка
		listItems.forEach(item => {
			item.remove()
		})

		//Выбор сортировки
		if (sortBy === 'default') {
			products.sort((a, b) => (a.id > b.id ? 1 : -1))
		} else if (sortBy === 'price') {
			products.sort((a, b) => (a.price > b.price ? 1 : -1))
		} else if (sortBy === 'title') {
			products.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
		}

		//Создание нового списка
		showList(limit, products)
		addDragAndDrop()
	})
}

//Функция, которая отрисовывает элементы на странице
function showList(limit, arrayOfItems) {
	let list = document.querySelector('.list')

	//вёрстка каждого элемента
	for (let i = 0; i < limit; i++) {
		list.innerHTML += `
		<li class="list__item">
			<h2>${arrayOfItems[i].title}</h2>
			<div class="list__item-description">
				<p>${arrayOfItems[i].description}</p>
				<p>Категория: ${arrayOfItems[i].category}</p>
				<p>Цена: ${arrayOfItems[i].price} у.е.</p>
				<p>Рейтинг: ${arrayOfItems[i].rating}</p>
				<p>На складе: ${arrayOfItems[i].stock} шт.</p>
			</div>
		</li>
		`
	}
}

//Функция, которая добавляет возможность перетаскивать элементы внутри списка
function addDragAndDrop() {
	const list = document.querySelector(`.list`)
	const listItem = list.querySelectorAll(`.list__item`)

	//Добавление элементам списка возможности перемещения
	for (const item of listItem) {
		item.draggable = true
	}

	//обработка событий "dragstart" и "dragend"
	list.addEventListener(`dragstart`, evt => {
		evt.target.classList.add(`selected`)
	})
	list.addEventListener(`dragend`, evt => {
		evt.target.classList.remove(`selected`)
	})

	//Получение элемента, перед которым нужно вставить перемещаемый элемент
	//currentElementCoord - координаты текущего элемента
	//currentElementCenter - центр текущего элемента
	//Если курсор находится выше центра элемента, то функция вернёт его, если нет - следующий
	const getNextElement = (cursorPosition, currentElement) => {
		const currentElementCoord = currentElement.getBoundingClientRect()
		const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2
		const nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling

		return nextElement
	}

	list.addEventListener(`dragover`, evt => {
		//Отмена дефолтного поведения браузера (он запрещает бросать элементы в область)
		evt.preventDefault()

		//Получение перетаскиваемого елемента
		const activeElement = list.querySelector(`.selected`)
		//Элемент, над которым находится курсор
		const currentElement = evt.target
		//Проверка срабатывания события на элементе списка и не на том, который тащим
		const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`list__item`)

		if (!isMoveable) {
			return
		}

		const nextElement = getNextElement(evt.clientY, currentElement)

		//Проверка необходимости менять элементы
		if ((nextElement && activeElement === nextElement.previousElementSibling) || activeElement === nextElement) {
			return
		}

		//Добавление элемента в список перед следующим
		list.insertBefore(activeElement, nextElement)
	})
}

createList()
