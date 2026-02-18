import './magoo.js'

import { prob_combine, inde_combine } from './magoo.js'

var input_divs
var autosave = false // change

var data = {
	invincible: {
		resistance: 0.49, //0.492 0.7945
	},
	skill: {
		thunder_spike: {
			name: "Thunder Spike",
			scale: 2.77,
			tags: ["attack", "lightning", "area", "melee", "shadow", "dexterity"],
			conversion: [{
				from: "physical",
				to: "lightning",
				rate: 1,
			}],
			cost: 5,
		},
		leap_attack: {
			name: "Leap Spike",
			scale: 2.77,
			tags: ["attack", "lightning", "area", "melee", "shadow", "dexterity"],
			conversion: [{
				from: "physical",
				to: "lightning",
				rate: 1,
			}],
			cost: 5,
		},
		blink_attack: {
			name: "Blink Spike",
			scale: 2.77,
			tags: ["attack", "lightning", "area", "melee", "shadow", "dexterity"],
			conversion: [{
				from: "physical",
				to: "lightning",
				rate: 1,
			}],
			cost: 5,
		},
	},
}

var sheet = {
	skilltemp: {
		type: "list",
	},
	dexterity: {
		label: "Dexterity",
		min: 0,
		type: "text",
	},
	enemy_accuracy: {
		label: "Enemy Accuracy",
		min: 130,
		max: 680,
		default: 680,
		type: "text",
	},
	damage: {
		label: "Damage",
		min: 0,
		variants: ["physical", "lightning"],
		type: "text",
	},
	critical_strike_rating: {
		label: "Critical Strike Rating",
		min: 0,
		type: "text",
	},
	attack_speed: {
		label: "Attack Speed",
		min: 0,
		type: "text",
	},
	dual_wield: {
		label: "Dual Wield",
		type: "check",
	},
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

/*
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

	/* draw input elements */

	let head = document.createElement("h1")
	head.append("Sheet")
	doc.append(head)

	for (let key in sheet) {

		let input = document.createElement("input")

		switch (sheet[key].type) {
			case "text":
				input.type = "text"
				input.className = "solid input-text end"
				break
			case "check":
				input.type = "checkbox"
				break
			case "list":
				console.log(sheet)
				break
			default:
				console.log(sheet[key])
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
			label.append(sheet[key].label, input, (sheet[key].type == "check" ? document.createElement("div") : []))
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

	//temp for list design
	document.querySelector("#testa").addEventListener("click", eventswitch, { passive: true })
	document.querySelector("#skill").addEventListener("input", eventswitch, { passive: true })
	//document.querySelector("#skill").addEventListener("click", eventswitch, {passive: true})
}

function calc() {

	/* input stats */

	let additional_damage
	let attack_critical
	let attack_damage
	let attack_speed_inc
	let critical_damage = 1.5
	let damage
	let dexterity
	let gear_attack_speed
	let gear_critical
	let gear_physical
	let lightning_damage
	let movement
	let numbed_effect = 0.18
	let skill_wad = 2.77
	let weapon_attack_speed = [1.5, 1.5]
	let weapon_critical = [500, 500]
	let weapon_physical = [154, 154]

	let additional_damage_combat
	let numbed_effect_combat//idk
	let numbed_stacks = 2

	let gear_lightning = [[1, 20], [3, 53]]
	let melee_damage = 0.51 + 0.59
	let elemental_damage = 0.56 + 0.41
	let physical_damage = 0.46

	/* output stats */

	let temp_weapon_physical = []
	let temp_weapon_attack_speed = []
	let temp_weapon_critical = []	//critical of each weapon

	let temp_critical_p = []		//critical of each weapon as a probability event group

	let additional_damage_bonus = 1
	let attack_speed_add
	let damage_bonus = 0
	let hit_flat
	let hit_prob
	let hit_temp
	let numbed_hit_prob
	let numbed_prob
	let out_numbed_effect

	/* validate stats */

	if (additional_damage === undefined) {
		additional_damage = []
	}

	if (gear_physical === undefined) {
		gear_physical = [0, 0]
	}

	if (gear_attack_speed === undefined) {
		gear_attack_speed = [0, 0]
	}

	if (gear_critical === undefined) {
		gear_critical = [0, 0]
	}

	/* intermediate stats */

	out_numbed_effect = 0.05 + numbed_effect + (movement / 0.01 * 0.004)

	damage_bonus = damage + attack_damage

	for (let a = 0; a < additional_damage.length; a++) {
		additional_damage_bonus = additional_damage_bonus * (1 + additional_damage[a])
	}

	/* weapon base physical damage, attack speed, critical */



	for (let a = 0; a < 2; a++) {
		let group = []

		temp_weapon_physical[a] = 0.5 * (gear_physical[a][0] + gear_physical[a][1]) + weapon_physical[a]
		temp_weapon_attack_speed[a] = weapon_attack_speed[a] * (gear_attack_speed[a] + 1)
		temp_weapon_critical[a] = Math.min(1, weapon_critical[a] * (gear_critical[a] + 1) * (attack_critical + 1) * 0.0001)
		group.push([critical_damage, temp_weapon_critical[a]])

		if (temp_weapon_critical[a] < 1) {
			group.push([1, (1 - temp_weapon_critical[a])])
		}

		temp_critical_p.push(group)
	}

	/*
	numbed hit prob values
	as, stack, prob
	1.5, 1 2, 1 / 2
	2.52 - 2.66, 1 2 2, 2 / 3
	*/

	numbed_hit_prob = 2 / 3 //idk

	numbed_prob = [[1 + (numbed_stacks - 1) * 0.05 * (1 + out_numbed_effect + numbed_effect_combat), (1 - numbed_hit_prob)], [1 + numbed_stacks * 0.05 * (1 + out_numbed_effect + numbed_effect_combat), numbed_hit_prob]]

	hit_prob = prob_combine(inde_combine(...temp_critical_p), numbed_prob)

	hit_flat = weapon_physical[0] * skill_wad * data.invincible.resistance * (1 + damage_bonus + lightning_damage) * (1 + dexterity * 0.005) * additional_damage_bonus

	hit_temp = weapon_physical[0] * skill_wad * data.invincible.resistance * (1 + damage_bonus + lightning_damage) * (1 + dexterity * 0.005) * additional_damage_bonus * (1 + additional_damage_combat)

	/* character results */

	results.dexterity.value = dexterity
	results.damage.value = damage_bonus
	results.lightning_damage.value = lightning_damage
	results.attack_speed.value = temp_weapon_attack_speed
	results.attack_speed_inc.value = attack_speed_inc
	results.attack_speed_add.value = attack_speed_add
	results.critical_chance.value = temp_weapon_critical
	results.critical_chance_bonus.value = attack_critical
	results.critical_damage.value = critical_damage
	results.numbed_effect.value = out_numbed_effect
	results.movement_speed.value = movement

	damage_value.attack_damage.value = hit_flat

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
	flex.className = "flex column"

	let flexsoliditem
	let flexitem
	let div

	let i = 0

	for (let m of a) {
		let ii = 0

		for (let [x, y] of m) {
			if (ii + 1 == m.size && i + 1 < a.length) {
				flexsoliditem = document.createElement("div")
				flexsoliditem.className = "flex space-between solid"

				div = document.createElement("div")
				div.className = "mr4"
				div.append(x)
				flexsoliditem.append(div)

				div = document.createElement("div")
				div.append(y)
				flexsoliditem.append(div)

				flex.append(flexsoliditem)
			} else {
				flexitem = document.createElement("div")
				flexitem.className = "flex space-between"

				div = document.createElement("div")
				div.className = "mr4"
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
			console.log('click', e)
			switch (e.target.type) {
				case "button":
					for (let a of input_divs) {
						if (sheet[a.id] != undefined) {
							a.value = sheet[a.id].default ? sheet[a.id].default : 0
						}
					}

					autosave = false

					localStorage.clear()
					e.target.blur()

					break

				default:
					console.warn(`event > click > e.target.type: ${e.target.type}`, e)
			}

			break

		case "input":
			console.log('hey')
			switch (e.target.type) {
				case "text":
					console.log('wat')
					if (sheet[e.target.id] && validate(e.target)) {
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

/*
have array of string values
	each array create sub array of each word
	["brown cow", "green apple", "blue toad"]
	>
	[["brown", "cow"], ["green", "apple"], ["blue", "toad"]]
on text
for each item in array of strings,
	character match
	build list of results
return results

matched text should be inverted, span class a & b

clicking a result fills that result

tab and right arrow finish the top result
*/