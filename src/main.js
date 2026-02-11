import './magoo.js'

var input_divs
var autosave = true

var sheet = {
	dexterity: {
		label: "Dexterity",
		min: 0,
	},
	enemy_accuracy: {
		label: "Enemy Accuracy",
		min: 130,
		max: 680,
		default: 680,
	},
	damage: {
		label: "Damage",
		min: 0,
		variants: ["physical", "lightning"],
	},
	critical_strike_rating: {
		label: "Critical Strike Rating",
		min: 0,
	},
	attack_speed: {
		label: "Attack Speed",
		min: 0,
	},
	dual_wield: {
		label: "Dual Wield",
		checkbox: true,
	},
}

var invincible = {
	resistance: 0.49,
}

var results = {
	attack_speed: {
		name: "Attack Speed",
		figs: 2,
	},
	attack_speed_add: {
		name: "Attack Speed Additional Bonus",
		percent: true,
	},
	critical_chance: {
		name: "Attack Critical Chance",
		figs: 2,
		percent: true,
	},
	critical_damage: {
		name: "Attack Critical Strike Damage",
		percent: true,
	},
	numbed_effect: {
		name: "Numbed Effect",
		percent: true,
	},
}

/*var skill = {
	corrosive_throw: {
		name: "Corrosive Throw",
		scale: 3.83,
		tags: ["dexterity", "erosion"],
		cost: 5,
	},
	lightning_attack: {
		name: "Lightning Attack",
		scale: 3.33,
		tags: ["dexterity", "lightning"],
		cost: 5,
	}
}

var mans = {
	green_mans: {
		name: "Green",
	},
	lightning_mans: {
		name: "Lightning",
		trait: {
			name: "trait",
			script: "",
		},
		talents: [
			[
				{
					name: "asdf",
					script: "",
				},
				{
					name: "bbs",
					script: ""
				},
			],
			[
				{
					name: "ceaw",
					script: "",
				},
				{
					name: "nae",
					script: ""
				},
			],
			[
				{
					name: "jydu",
					script: "",
				},
				{
					name: "faew",
					script: ""
				},
			],
		],
	},
} */

init()
calc()
calc_draw()

function init() {

	/* load */

	let save_sheet = JSON.parse(localStorage.getItem("sheet"))

	if (save_sheet != null) {
		for (let k in save_sheet) {
			if (sheet[k] != undefined) {
				sheet[k] = save_sheet[k]
			}
		}
	}

	/* place input elements */

	let head = document.createElement("h1")
	head.append("Sheet")
	doc.append(head)

	for (let key in sheet) {

		let input = document.createElement("input")

		if (sheet[key].checkbox) {
			input.type = "checkbox"
		} else {
			input.type = "text"
		}

		input.id = key

		if (sheet[key].value) {
			input.value = sheet[key].value
		} else {
			input.value = sheet[key].default ? sheet[key].default : 0
		}

		doc.append(input)

		if (sheet[key].label) {
			let label = document.createElement("label")

			input.insertAdjacentElement("beforebegin", label)
			label.append(sheet[key].label, input, (sheet[key].checkbox ? document.createElement("div") : []))
		}

		input.addEventListener("input", eventswitch, { passive: true })
	}

	/* set vars & add events */

	input_divs = document.querySelectorAll("input")

	document.addEventListener("visibilitychange", eventswitch)

	for (let a of input_divs) {
		if (a.type == "button") {
			a.addEventListener("click", eventswitch, { passive: true })
		}
	}
}

function calc() {

	/* input stats */

	let skill_wad = 2.77
	let weapon_pd = [154, 154]
	let weapon_as = [1.5, 1.5]
	let weapon_rating = [500, 500]
	let critical_damage = 1.5
	let numbed_effect = 0.18
	let numbed_stacks = 1.5

	let dual_wield = true

	/* output stats */

	let weapon_pdps = weapon_pd * weapon_as

	let attack_speed
	let critical_rating
	let attack_speed_add

	/* intermediate stats */

	let crit_scale

	if (dual_wield) {
		attack_speed_add = 0.1
		critical_rating = weapon_rating.scale(0.0001)
		attack_speed = weapon_as.scale(1 + attack_speed_add)
		
		crit_scale = critical_rating.scale(critical_damage - 1).add(1)
	} else {
		critical_rating = weapon_rating[0] * 0.0001
		attack_speed = weapon_as[0]

		crit_scale = 1 + critical_rating * (critical_damage - 1)
	}

	let prenumb = 1 + (numbed_stacks * 0.05 * (1 + numbed_effect))
	let prenumb2 = 1 + (0.05 * (1 + numbed_effect))

	console.log(weapon_pd[0] * skill_wad * invincible.resistance * prenumb, prenumb)

	/* probability stats */

	let numbed_prob = [[1 + 0.05 * (1 + numbed_effect), 0.5], [1 + 2 * 0.05 * (1 + numbed_effect), 0.5]]
	let crit_prob = [critical_damage, critical_rating[0]]

	console.log(numbed_prob, crit_prob)
	
	/* set results */

	results.attack_speed.value = attack_speed
	results.attack_speed_add.value = attack_speed_add
	results.critical_chance.value = critical_rating
	results.critical_damage.value = critical_damage
	results.numbed_effect.value = numbed_effect
}

function calc_draw() {
	let head = document.createElement("h1")

	head.append("Results")
	doc.append(head)

	/* character info */

	head = document.createElement("h2")
	head.append("Character Stats")
	doc.append(head)

	let keys = Object.keys(results)

	let group = new Map()

	for (let i = 0; i < keys.length; i++) {
		if (results[keys[i]].value) {
			if (results[keys[i]].value[0]) {
				for (let ii = 0; ii < results[keys[i]].value.length; ii++) {
					if (!ii) {
						group.set(`Main Hand ${results[keys[i]].name}`, `${(results[keys[i]].percent ? (results[keys[i]].value[0] * 100).trim(results[keys[i]].figs) + "%" : results[keys[i]].value[0].trim(results[keys[i]].figs))}`)
					} else {
						group.set(`Off Hand ${results[keys[i]].name}`, `${(results[keys[i]].percent ? (results[keys[i]].value[1] * 100).trim(results[keys[i]].figs) + "%" : results[keys[i]].value[1].trim(results[keys[i]].figs))}`)
					}
				}
			} else {
				group.set(results[keys[i]].name, `${(results[keys[i]].percent ? (results[keys[i]].value * 100).trim(results[keys[i]].figs) + "%" : results[keys[i]].value.trim(results[keys[i]].figs))}`)
			}
		}
	}

	doc.append(flextable([group]))
}

function flextable(a) {
	let _flex = document.createElement("div")
	_flex.classList.add("flex", "column")

	let _flexsoliditem
	let _flexitem
	let _div

	let _i = 0

	for (let m of a) {
		let _ii = 0

		for (let [x, y] of m) {
			if (_ii + 1 == m.size && _i + 1 < a.length) {
				_flexsoliditem = document.createElement("div")
				_flexsoliditem.classList.add("flex", "space-between", "solid")

				_div = document.createElement("div")
				_div.append(x)
				_flexsoliditem.append(_div)

				_div = document.createElement("div")
				_div.append(y)
				_flexsoliditem.append(_div)

				_flex.append(_flexsoliditem)
			} else {
				_flexitem = document.createElement("div")
				_flexitem.classList.add("flex", "space-between")

				_div = document.createElement("div")
				_div.append(x)
				_flexitem.append(_div)

				_div = document.createElement("div")
				_div.append(y)
				_flexitem.append(_div)

				_flex.append(_flexitem)

				_ii++
			}
		}

		_i++
	}
	return _flex
}

function validate(i) {
	if (i.value > sheet[i.id].max) {
		i.setCustomValidity(`Max value is ${sheet[i.id].max}`)
	} else if (i.value < sheet[i.id].min) {
		i.setCustomValidity(`Minimum value is ${sheet[i.id].min}`)
	} else if (Number.isNaN(+i.value)) {
		i.setCustomValidity(`Number required`)
	} else {
		i.setCustomValidity(``)
	}
	return i.validity.customError ? false : true
}

function eventswitch(e) {
	switch (e.type) {
		case "click":
			switch (e.target.type) {
				case "button":
					for (let a of input_divs) {
						if (sheet[a.id] != undefined) {
							a.value = sheet[a.id].default ? sheet[a.id].default : 0
						}
					}

					autosave = false

					localStorage.clear()
					break

				default:
					console.warn(`event > click > e.target.type: ${e.target.type}`, e)
			}

			e.target.blur()
			break

		case "input":
			switch (e.target.type) {
				case "text":
					if (validate(e.target)) {
						sheet[e.target.id].value = e.target.value
					}
					break

				case "checkbox":
					break

				default:
					console.warn(`event > input > e.target.type: ${e.target.type}`, e)
			}

			//calc(e.target)
			break

		case "visibilitychange":
			if (document.visibilityState == "hidden" && autosave) {
				localStorage.setItem("sheet", JSON.stringify(sheet))
			}
			break

		default:
			console.warn(`event > e.type: ${e.type}`, e)
	}
}