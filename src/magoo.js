Array.prototype.add = function (n = 0) {
	let a = []
	for (let x of this) {
		a.push(x + n)
	}
	return a
}

/* breaks with [1.5].scale(1.276)*/

Array.prototype.scale = function (n = 1) {
	let a = []
	for (let x of this) {
		a.push(x * n)
	}
	return a
}

/* breaks with output of [1.5].scale(1.276) */

Number.prototype.trim = function (n = 0) {
	return Math.trunc(this) + Math.round(this % 1 * 10 ** n) / 10 ** n
}

export function compare(a, b) {
	let msg = ""

	if (typeof a != typeof b) {
		msg += `not the same type\n`
	}

	if (a.length != b.length) {
		msg += `not the same length\n`
	}

	//dont need to sort, running total
	let sorta = [...a].sort((x, y) => x[0] - y[0])
	let sortb = [...b].sort((x, y) => x[0] - y[0])

	for (let i = 0; i < sorta.length; i++) {
		if ((sorta[i][0] - sortb[i][0]) || (sorta[i][1] - sortb[i][1])) {
			msg += `mismatch\n`
		}
	}

	if (!msg) {
		msg = `seems good`
	}

	return msg
}

export function gr_note(b = 1, r = 5) {
	let result = ""
	for (let x = 0; x <= r; x++) {
		result += `${x} ${(b * (((1 + 5 ** (1 / 2)) / 2) ** x)).trim(2)}\n`
	}
	return result
}

export function prob_combine(...m) {
	let output_array = []
	let merge_obj = {}
	let prob_group = [[1, 1]]

	for (let a = 0; a < m.length; a++) {
		let run_prob = 0
		let event_array = []
		let new_group = []

		for (let b = 0; b < m[a].length; b++) {
			run_prob += m[a][b][1]
			event_array.push(m[a][b])
		}

		if (1 - run_prob) {
			event_array.push([1, 1 - run_prob])
		}

		for (let b = 0; b < event_array.length; b++) {
			for (let c = 0; c < prob_group.length; c++) {
				let value = event_array[b][0] * prob_group[c][0]
				let prob = event_array[b][1] * prob_group[c][1]

				if (a + 1 == m.length) {
					merge_obj[value] = (merge_obj[value] || 0) + prob
				}

				new_group.push([value, prob])
			}
		}

		prob_group = new_group
	}

	for (let [k, v] of Object.entries(merge_obj)) {
		output_array.push([Number(k), v])
	}

	return output_array
}

export function inde_combine(...m) {
	let obj = {}
	let array = []

	for (let a = 0; a < m.length; a++) {
		for (let b = 0; b < m[a].length; b++) {
			obj[m[a][b][0]] = (obj[m[a][b][0]] || 0) + m[a][b][1] / m.length
		}
	}

	for (let [k, v] of Object.entries(obj)) {
		array.push([Number(k), v])
	}

	return array
}