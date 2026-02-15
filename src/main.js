import './magoo.js'

import { prob_combine, compare } from './magoo.js'

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
	resistance: 0.49, //0.492 0.7945
}

let damage_value = {
	attack_dps: {
		name: "Attack DPS"
	},
	attack_damage: {
		name: "Attack Damage"
	},
}

var results = {
	dexterity: {
		name: "Dexterity"
	},
	damage: {
		name: "Damage Bonus",
		percent: true,
	},
	lightning_damage: {
		name: "Lightning Damage Bonus",
		percent: true,
	},
	attack_speed: {
		name: "Attack Speed",
		figs: 2,
	},
	attack_speed_inc: {
		name: "Attack Speed Bonus",
		percent: true,
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
	critical_chance_bonus: {
		name: "Attack Critical Strike",
		percent: true,
	},
	critical_damage: {
		name: "Attack Critical Strike Damage",
		percent: true,
	},
	numbed_effect: {
		name: "Numbed Effect",
		percent: true,
		figs: 1,
	},
	movement_speed: {
		name: "Movement Speed Bonus",
		percent: true,
	},
}

var hidden_output = {
	average_hit: 0,
	dps: 0,
	hits: [],
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

	let additional_damage = [0.07, 0.04, 0.02, 0.05, 0.05, 0.04]
	let attack_critical_rating = 0.4 + 1.76
	let attack_damage = 1.24
	let attack_speed_inc = 0.29 + 0.24 + 0.08 + 0.18
	let critical_damage = 1.5
	let damage = 0.84 + 0.24 + 0.27 + 0.54 + 1.44
	let dexterity = 0
	let lightning_damage = 0.28
	let movement = 0.06 + 0.12
	let numbed_effect = 0.18 + 0.25
	let numbed_effect_combat = 0.3 //idk
	let numbed_stacks = 2
	let skill_wad = 2.77
	let weapon_as = [1.5, 1.5]
	let weapon_pd = [154, 154]
	let weapon_rating = [500, 500]

	let additional_damage_combat = 0.03
	let dual_wield = true
	

	/* output stats */

	let additional_damage_bonus = 1
	let attack_speed
	let attack_speed_add
	let crit_prob
	let damage_bonus = 0
	let hit_flat
	let hit_prob
	let hit_temp
	let numbed_hit_prob
	let numbed_prob
	let out_numbed_effect
	let total_critical_rating

	/* intermediate stats */

	if (dual_wield) {
		attack_speed_add = 0.1
		total_critical_rating = weapon_rating.scale(0.0001 * (1 + attack_critical_rating))
		attack_speed = weapon_as.scale((1 + attack_speed_add) * (1 + attack_speed_inc))
	} else {
		total_critical_rating = weapon_rating[0] * 0.0001 * (1 + attack_critical_rating)
		attack_speed = weapon_as[0] * (1 + attack_speed_inc)
	}

	out_numbed_effect = 0.05 + numbed_effect + (movement / 0.01 * 0.004)

	damage_bonus = damage + attack_damage

	for (let a = 0; a < additional_damage.length; a++) {
		additional_damage_bonus = additional_damage_bonus * (1 + additional_damage[a])
	}

	crit_prob = [[critical_damage, total_critical_rating[0]]]

	/*
	numbed hit prob values
	as, stack, prob
	1.5, 1 2, 1 / 2
	2.52 - 2.66, 1 2 2, 2 / 3
	*/

	numbed_hit_prob = 2 / 3 //idk

	numbed_prob = [[1 + (numbed_stacks - 1) * 0.05 * (1 + out_numbed_effect + numbed_effect_combat), (1 - numbed_hit_prob)], [1 + numbed_stacks * 0.05 * (1 + out_numbed_effect + numbed_effect_combat), numbed_hit_prob]]

	hit_prob = prob_combine(crit_prob, numbed_prob)

	hit_flat = weapon_pd[0] * skill_wad * invincible.resistance * (1 + damage_bonus + lightning_damage) * (1 + dexterity * 0.005) * additional_damage_bonus
	
	hit_temp = weapon_pd[0] * skill_wad * invincible.resistance * (1 + damage_bonus + lightning_damage) * (1 + dexterity * 0.005) * additional_damage_bonus * (1 + additional_damage_combat)
	
	/* character results */

	results.dexterity.value = dexterity
	results.damage.value = damage_bonus
	results.lightning_damage.value = lightning_damage
	results.attack_speed.value = attack_speed
	results.attack_speed_inc.value = attack_speed_inc
	results.attack_speed_add.value = attack_speed_add
	results.critical_chance.value = total_critical_rating
	results.critical_chance_bonus.value = attack_critical_rating
	results.critical_damage.value = critical_damage
	results.numbed_effect.value = out_numbed_effect
	results.movement_speed.value = movement

	damage_value.attack_damage.value = hit_flat
	damage_value.attack_dps.value = hit_flat * (1 + total_critical_rating[0] * (critical_damage - 1)) * attack_speed[0]

	/* damage results */

	for (let a = 0; a < hit_prob.length; a++) {
		hidden_output.hits.push([hit_temp * hit_prob[a][0], hit_prob[a][1]])
		hidden_output.average_hit += hit_temp * hit_prob[a][0] * hit_prob[a][1]
	}

	hidden_output.dps = hidden_output.average_hit * results.attack_speed.value[0]
}

function calc_draw() {
	let head = document.createElement("h1")

	head.append("Results")
	doc.append(head)

	/* character info */

	head = document.createElement("h2")
	head.append("Character Stats")
	doc.append(head)

	let attack_group = new Map()

	let keys = Object.keys(damage_value)

	for (let i = 0; i < keys.length; i++) {
		if (damage_value[keys[i]].value) {
			attack_group.set(damage_value[keys[i]].name, damage_value[keys[i]].value.trim())
		}
	}

	let group = new Map()

	keys = Object.keys(results)

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

	doc.append(flextable([attack_group, group]))

	/* hit damage */

	head = document.createElement("h2")
	head.append("Damage")
	doc.append(head)

	let sorthit = [...hidden_output.hits].sort((x, y) => y[0] - x[0])

	group = new Map()

	for (let i = 0; i < sorthit.length; i++) {
		group.set(sorthit[i][0].trim(1), `${(sorthit[i][1] * 100).trim(1)}%`)
	}

	doc.append(flextable([new Map([["Hit", "%"]]), group, new Map([["Average Hit", hidden_output.average_hit.trim(1)], ["Attack Speed", results.attack_speed.value[0].trim(2)]]), new Map([["Damage / second", hidden_output.dps.trim(1)]])]))
}

function flextable(a) {
	let flex = document.createElement("div")
	flex.classList.add("flex", "column")

	let flexsoliditem
	let flexitem
	let div

	let i = 0

	for (let m of a) {
		let ii = 0

		for (let [x, y] of m) {
			if (ii + 1 == m.size && i + 1 < a.length) {
				flexsoliditem = document.createElement("div")
				flexsoliditem.classList.add("flex", "space-between", "solid")

				div = document.createElement("div")
				div.append(x)
				flexsoliditem.append(div)

				div = document.createElement("div")
				div.append(y)
				flexsoliditem.append(div)

				flex.append(flexsoliditem)
			} else {
				flexitem = document.createElement("div")
				flexitem.classList.add("flex", "space-between")

				div = document.createElement("div")
				div.append(x)
				flexitem.append(div)

				div = document.createElement("div")
				div.append(y)
				flexitem.append(div)

				flex.append(flexitem)

				ii++
			}
		}

		i++
	}
	return flex
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