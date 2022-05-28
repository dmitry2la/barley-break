import './css/reset.scss'
import './css/style.scss'

const board = document.getElementById('board-wrapper')
const chips = Array.from(document.querySelectorAll('.number'))
const winText = document.querySelector('.win-text')
const countChips = 16

if (chips.length !== countChips) {
	throw new Error(`Must be exactly ${countChips} elements in HTML`)
}

/** Positions chips */

chips[countChips - 1].style.display = 'none'
let matrix = getMatrix(
	chips.map((item) => +item.dataset.id)
)
setPositions(matrix)


/** Shuffle */

document.getElementById('shuffle-button').addEventListener('click', () => {
	const shuffledArray = shuffleArray(matrix.flat())
	matrix = getMatrix(shuffledArray)
	setPositions(matrix)
})

/** Change position */

const blankNumber = 16
board.addEventListener('click', (event) => {
	const chip = event.target.closest('button')
	if (!chip) return

	const chipNumber = +chip.dataset.id
	const chipPositions = findPositionByNumber(chipNumber)
	const blankPositions = findPositionByNumber(blankNumber)

	const canSwap = isCanSwap(chipPositions, blankPositions)
	if (canSwap) {
		swapChips(chipPositions, blankPositions);
		setPositions(matrix)
	}
})

window.addEventListener('keydown', (event) => {
	if (!event.key.includes('Arrow')) return

	const blankPositions = findPositionByNumber(blankNumber)
	const chipPositions = {
		x: blankPositions.x,
		y: blankPositions.y
	}

	switch (event.key) {
		case 'ArrowUp':
			chipPositions.y += 1
			break;
		case 'ArrowDown':
			chipPositions.y -= 1
			break;
		case 'ArrowLeft':
			chipPositions.x += 1
			break;
		case 'ArrowRight':
			chipPositions.x -= 1
			break;
	}

	if (chipPositions.y >= 4 ||
		chipPositions.y < 0  ||
		chipPositions.x >= 4 ||
		chipPositions.x < 0) return

	swapChips(chipPositions, blankPositions)
	setPositions(matrix)
})


/** help functions */

function getMatrix(arr) {
	const matrix = [[], [], [], []]
	let x = 0
	let y = 0

	for (let i = 0; i < arr.length; i++) {
		if (x >= 4) {
			y++
			x = 0
		}
		matrix[y][x] = arr[i]
		x++
	}
	return matrix
}

function setPositions(matrix) {
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const value = matrix[y][x]
			const node = chips[value - 1]
			setNodeStyles(node, x, y)
		}
	}
}

function setNodeStyles(node, x, y) {
	const shift = 100;
	node.style.transform = `translate3D(${ x * shift }%, ${ y * shift }%, 0)`
	node.style.zIndex = `${ y + 1 }`
}

function shuffleArray(arr) {
	return arr
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
}

function findPositionByNumber(number) {
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			if (matrix[y][x] === number) return { x, y }
		}
	}
	return null
}

function isCanSwap(chip, blank) {
	const diffX = Math.abs(chip.x - blank.x)
	const diffY = Math.abs(chip.y - blank.y)
	return (diffX === 1 || diffY === 1) && (chip.x === blank.x || chip.y === blank.y)
}

function swapChips(chip, blank) {
	let temp = matrix[chip.y][chip.x]
	matrix[chip.y][chip.x] = matrix[blank.y][blank.x]
	matrix[blank.y][blank.x] = temp

	if (isWon()) {
		setTimeout(() => {
			board.classList.add('win')
			winText.classList.add('active')
			setTimeout(() => {
				board.classList.remove('win')
				winText.classList.remove('active')
			}, 1000)
		}, 200)
	}
}

function isWon() {
	const flatMatrix = matrix.flat()
	for (let i = 0; i < countChips; i++) {
		if (flatMatrix[i] !== i + 1) return false
	}
	return true
}
