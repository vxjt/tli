Array.prototype.add = function (n = 0) {
	let a = []
	for (let x of this) {
		a.push(x + n)
	}
	return a
}

Array.prototype.scale = function (n = 1) {
	let a = []
	for (let x of this) {
		a.push(x * n)
	}
	return a
}

Number.prototype.trim = function (n = 0) {
	return Math.trunc(this) + Math.round(this % 1 * 10 ** n) / 10 ** n
}

export function gr_note(b = 1, r = 5) {
	let result = ""
	for (let x = 0; x <= r; x++) {
		result += `${x} ${(b * (((1 + 5 ** (1 / 2)) / 2) ** x)).trim(2)}\n`
	}
	return result
}