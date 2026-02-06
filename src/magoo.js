Number.prototype.trim = function (n = 0) {
	return Math.trunc(this) + Math.round(this % 1 * 10 ** n) / 10 ** n
}

export function gr_note(b = 1, r = 5) {
	let result = ``
	for (let x = 0; x <= r; x++) {
		result += `${x} ${(b * (((1 + 5 ** (1 / 2)) / 2) ** x)).trim(2)}\n`
	}
	return result
}