import './magoo.js'

const doc_div = document.querySelector("#doc")
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
		variants: ["physical"],
	},
	critical_strike_rating: {
		label: "Critical Strike Rating",
		min: 0,
	},
	attack_speed: {
		label: "Attack Speed",
		min: 0,
	},
}

var invincible = {
	resistance: 0.49,
}

var hit_map = new Map()

var results = {
	attack_speed: {
		name: "Attack Speed",
		value: null,
		figs: 2,
	},
	critical_chance: {
		name: "Critical Strike Chance",
		figs: 2,
		percent: true,
		value: null,
	},
}

var skill = {
	corrosive_throw: {
		name: "Corrosive Throw",
		scale: 3.83,
		tags: ["dexterity"],
		cost: 5,
	},
}

init()
calc()
calc_draw()

function init() {
	document.addEventListener("visibilitychange", eventswitch)

	/* load */

	let _sheet = JSON.parse(localStorage.getItem("sheet"))

	if (_sheet != null) {
		for (let k in _sheet) {
			if (sheet[k] != undefined) {
				sheet[k] = _sheet[k]
			}
		}
	}

	/* place elements */

	let _h = document.createElement("h1")
	_h.append("Stats")
	doc_div.append(_h)

	for (let k in sheet) {
		let i = document.createElement("input")

		i.id = k
		i.type = "text"

		if (sheet[k].value) {
			i.value = sheet[k].value
		} else {
			i.value = sheet[k].default ? sheet[k].default : 0
		}

		doc_div.append(i)

		if (sheet[k].label) {
			let _label = document.createElement("label")

			i.insertAdjacentElement("beforebegin", _label)
			_label.append(sheet[k].label, i)
		}

		i.addEventListener("input", eventswitch, { passive: true })
	}

	/* expand elements */

	input_divs = document.querySelectorAll("input")

	for (let a of input_divs) {
		if (a.type == "button") {
			a.addEventListener("click", eventswitch, { passive: true })
		}
	}
}

function calc(e) {
	let attack_speed = 1.5
	let critical_rating = 500
	let physical_damage = 154
	let critical_damage = 1.5
	let corrosive_multistrike_chance = 0.2
	let motionless_add_damage = 1.1
	let stalker_add_damage = 1 + (0.13 * 3)
	let dual_wield_attack_speed = 1.1
	let multistrike_attack_speed = 1.2
	let critical_rating_bonus = 1 + 2.1
	let multistrike_damage = 0.27

	// 20% chance for multistrike attack speed to as - stalker add damage to physical damage - 

	/* results */

	results.critical_chance.value = (critical_rating / 10000) * critical_rating_bonus

	results.attack_speed.value = attack_speed * dual_wield_attack_speed

	let scale_res_motion = skill.corrosive_throw.scale * invincible.resistance * motionless_add_damage
	let critical_mod = 1 + (critical_damage * results.critical_chance.value)
	let multi_mod = 1 + (corrosive_multistrike_chance * multistrike_attack_speed)

	let multi_dmg = physical_damage * scale_res_motion * (1 + 2 * multistrike_damage) * stalker_add_damage

	/*
	console.log(
		(physical_damage * stalker_add_damage * scale_res_motion).trim(1),
		(physical_damage * stalker_add_damage * critical_damage * scale_res_motion).trim(1),
		attack_speed * dual_wield_attack_speed * multistrike_attack_speed,
		(physical_damage * scale_res_motion).trim(0),
		(physical_damage * critical_damage * scale_res_motion).trim(0),
		multi_dmg,
		corrosive_multistrike_chance + 1.16,
	)
	*/

	//318 404 489

	//442 561 680

	//damage - physical_damage * scale_res_motion
	//crit - 'damage' * critical_damage
	//multistrike damage - 'damage' * stalker_add_damage

	//console.log(critical_damage, results.critical_chance.value)
}

function calc_draw() {
	let _h = document.createElement("h1")

	_h.append("Results")
	doc_div.append(_h)

	_h = document.createElement("h2")
	_h.append("Damage")
	doc_div.append(_h)

	/* ev table */

	let _head = new Map()
	_head.set("Hit", "%")

	hit_map.set(1234, 0.15)
	hit_map.set(694, 0.3)
	hit_map.set(93, 0.5)
	hit_map.set(1, 0.05)

	let _hits = new Map()

	for(let [a, b] of hit_map) {
		_hits.set(a, `${(b * 100)}%`)
	}

	let _averages = new Map()
	_averages.set("Average hit", 420)
	_averages.set("Attacks / second", 3.3)

	let _dps = new Map()
	_dps.set("Damage / second", 420.69)

	let flextable_in = [
		_head,
		_hits,
		_averages,
		_dps,
	]

	doc_div.append(flextable(flextable_in))

	/* character sheet */

	_h = document.createElement("h2")
	_h.append("Character Sheet")
	doc_div.append(_h)

	let _keys = Object.keys(results)

	for (let i = 0; i < _keys.length; i++) {
		if (results[_keys[i]].figs && results[_keys[i]].value) {
			if (results[_keys[i]].percent) {
				doc_div.append(`${results[_keys[i]].name}: ${(results[_keys[i]].value * 100).trim(results[_keys[i]].figs)}%`)
			} else {
				doc_div.append(`${results[_keys[i]].name}: ${(results[_keys[i]].value).trim(results[_keys[i]].figs)}`)
			}
		} else {
			doc_div.append(`${results[_keys[i]].name}: ${results[_keys[i]].value * 100}`)
		}

		if (i + 1 != _keys.length) {
			doc_div.append(document.createElement("br"))
		}
	}
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
					console.warn(`event > click > e.target.value: ${e.target.value}`, e)
			}

			e.target.blur()
			break

		case "input":
			if (validate(e.target)) {
				sheet[e.target.id].value = e.target.value
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