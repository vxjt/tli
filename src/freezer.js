function flextable(a) {
	let flex = document.createElement("div")
	flex.className = "inline-flex column"

	let flexsoliditem
	let flexitem
	let div

	let i = 0

	for (let m of a) {
		let ii = 0

		for (let [x, y] of m) {
			if (ii + 1 == m.size && i + 1 < a.length) {
				flexsoliditem = document.createElement("div")
				flexsoliditem.className = "inline-flex space-between solid"

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
				flexitem.className = "inline-flex space-between"

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

function draw_results() {
	let output = `<h1>Results</h1>`
	for (let a in results) {
		switch (results[a].type) {
			case "h2":
				output += `<h2>${results[a].name}</h2>`
				break
			case "h3":
				output += `<h3>${results[a].name}</h3>`
				break
			case "h4":
				output += `<h4>${results[a].name}</h4>`
				break
			default:
				if (results[a].value) {
					output += `${results[a].name}: ${results[a].value}`
				}
		}
	}
	doc.append(document.createRange().createContextualFragment(cleanhtml(output)))
}

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

	/* generate sheet list items */

	for (let a in data.skill) {
		sheet.skill.items[a] = data.skill[a].name
	}

	/* draw input elements */

	let output_string = `<h1>Sheet</h1>`

	for (let key in sheet) {
		let string = ``

		switch (sheet[key].type) {
			case "list":
				for (let a of Object.values(sheet[key].items)) {
					string += `<div class="list-item">${a}</div>`
				}

				output_string +=
					`<label class="flex">${sheet[key].name}
						<div class="flex list-container relative solid margin-left">
							<input autocomplete="off" id="${key}" type="text" class="input-list">...
							<div class="outline">${string}</div>
						</div>
					</label>`
				break

			case "dual-group":
				for (let a of Object.values(sheet[key].items)) {
					string +=
						`<label class="flex">
							<div class="flex50">${a.name}</div>
							<div class="flex50 flex">
								<input id="${key}" type="text" class="solid end input-text">
								<div class="divider"></div>
								<input id="${key}_off" type="text" class="solid end input-text">
							</div>
						</label>`
				}

				output_string +=
					`<div class="inline-flex column">
						${sheet[key].name}${string}
						<label class="flex">
							<div class="flex50">${sheet[key].name_toggle}</div>
							<div class="flex50">
								<input id="${key}" type="checkbox"><div class="outline"></div>
							</div>
						</label>
					</div>`
				break
		}
	}

	doc.append(document.createRange().createContextualFragment(cleanhtml(output_string)))

	/* set vars & add events */

	input_divs = document.querySelectorAll("input")
	list_divs = document.querySelectorAll(".list-item")
	for (let a of input_divs) {

		switch (a.type) {
			case "button":
				a.addEventListener("click", eventswitch, { passive: true })
				break

			case "checkbox":
				if (sheet[a.id].default) {
					a.checked = sheet[a.id].default
				} else {
					a.checked = false
				}
				break

			case "text":
				switch (sheet[a.id].type) {
					case "list":
						if (sheet[a.id].default) {
							a.value = sheet[a.id].default
						} else {
							a.value = Object.values(sheet[a.id].items)[0]
						}
						break

					case "text":
						if (sheet[a.id].default) {
							a.value = sheet[a.id].default
						} else {
							a.value = 0
						}
						break
				}
		}
	}

	for (let a of list_divs) {
		a.addEventListener("mousedown", eventswitch, { passive: true })
	}
}

function event(e) {
	switch (e.type) {
		case "click":
			switch (e.target.type) {
				case "button":
					for (let a of input_divs) {
						if (sheet[a.id] != undefined) {
							switch (sheet[a.id].type) {
								case "check":
									if (sheet[a.id].default) {
										a.checked = sheet[a.id].default
									} else {
										a.checked = false
									}
									break

								case "list":
									if (sheet[a.id].default) {
										a.value = sheet[a.id].default
									} else {
										a.value = Object.values(sheet[a.id].items)[0]
									}
									break

								case "text":
									if (sheet[a.id].default) {
										a.value = sheet[a.id].default
									} else {
										a.value = 0
									}
									break
							}
						}
					}

					autosave = false

					localStorage.clear()
					e.target.blur()

					break
			}
			break

		case "input":
			switch (e.target.type) {
				case "text":
					if (sheet[e.target.id] && validate(e.target)) {
						sheet[e.target.id].value = e.target.value
					}
					break

				case "checkbox":
					break
			}
			break

		case "mousedown":
			e.target.parentNode.previousElementSibling.value = e.target.innerText
			break
	}
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

var results2 = {
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

/* calc */

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

	/*results.dexterity.value = dexterity
	results.damage.value = damage_bonus
	results.lightning_damage.value = lightning_damage
	results.attack_speed.value = temp_weapon_attack_speed
	results.attack_speed_inc.value = attack_speed_inc
	results.attack_speed_add.value = attack_speed_add
	results.critical_chance.value = temp_weapon_critical
	results.critical_chance_bonus.value = attack_critical
	results.critical_damage.value = critical_damage
	results.numbed_effect.value = out_numbed_effect
	results.movement_speed.value = movement*/

	damage_value.attack_damage.value = hit_flat

	/* damage results */

	for (let a = 0; a < hit_prob.length; a++) {
		hidden_output.hits.push([hit_temp * hit_prob[a][0], hit_prob[a][1]])
		hidden_output.average_hit += hit_temp * hit_prob[a][0] * hit_prob[a][1]
	}

	//hidden_output.dps = hidden_output.average_hit * results.attack_speed.value[0]

/* calc draw */

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


/* input draw */

let input = document.createElement("input")
let fragment

switch (sheet[key].type) {
	case "text":
		input.type = "text"
		input.className = "solid input-text end"
		break
	case "check":
		input.type = "checkbox"
		break
	case "list":
		console.log(sheet[key])
		let tempstring = "<div>"

		for (let a of Object.values(sheet[key].items)) {
			tempstring += `<div>${a}</div>`
		}
		tempstring += "</div>"
		input.type = "text"
		input.className = "solid input-list end"
		fragment = range.createContextualFragment(tempstring)
		break
	default:
		console.warn(`init > sheet[key].type: ${sheet[key].type}`, sheet[key])
}

input.id = key

if (sheet[key].value) {
	input.value = sheet[key].value
} else {
	if (sheet[key].default === undefined) {
		input.value = 0
	} else {
		input.value = sheet[key].default
	}
}

doc.append(input)
if (fragment) {
	doc.append(fragment)
}

if (sheet[key].label) {
	let label = document.createElement("label")

	input.insertAdjacentElement("beforebegin", label)
	label.append(sheet[key].label, input, (sheet[key].type == "check" ? document.createElement("div") : []))
}

/* draw */ 

{
	head = document.createElement("h2")
	head.append("Damage")
	doc_div.append(head)

	/* ev table */

	let title = new Map()
	title.set("Hit", "%")

	hit_map.set(1234, 0.15)
	hit_map.set(694, 0.3)
	hit_map.set(93, 0.5)
	hit_map.set(1, 0.05)

	let hits = new Map()

	for (let [a, b] of hit_map) {
		hits.set(a, `${(b * 100)}%`)
	}

	let averages = new Map()
	averages.set("Average hit", 420)
	averages.set("Attacks / second", 3.3)

	let dps = new Map()
	dps.set("Damage / second", 420.69)

	let flextable_in = [
		title,
		hits,
		averages,
		dps,
	]

	doc_div.append(flextable(flextable_in))
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

function calc() {

	//var sheetacc = sheet.evasion ** 0.75 * (0.5 - 0.5 * attackevasion) / (attackevasion + 0.15)
	
	sheet.enemy_accuracy = Math.min(680, Math.max(sheet.enemy_accuracy, 130))

	attackevade = 1 - 1.15 * sheet.enemy_accuracy / (sheet.enemy_accuracy + 0.5 * sheet.evasion ** 0.75)

	if (attackevade > 0.75) {
		attackevade = 0.75
	} else if (attackevade < 0) {
		attackevade = 0
	}

	spellevade = 1 - 1.15 * sheet.enemy_accuracy / (sheet.enemy_accuracy + 0.340866 * sheet.evasion ** 0.75)

	if (spellevade > 0.75) {
		spellevade = 0.75
	} else if (spellevade < 0) {
		spellevade = 0
	}

	block_mitigation = 1 - attackblock * blockratio

	input_divs.forEach((v) => {
		hit.set(v.id, v.value)
	})

	hit.forEach((v, k) => {
		let res
		res = resistance[k] ? 1 - resistance[k] : 1
		hit.set(k, v * res * (1 - attackevade) * block_mitigation)
	})

	let hits = ""
	let count = 0

	hit.forEach((v, k) => {
		count++
		let val = v.trim(2)
		if (val > 0) {
			hits += `${val} ${k}`
			if (count < hit.size) {
				hits += `, `
			} else {
				hits += `.`
			}
		}
	})

	doc_div.outerHTML = `
	<h1>Results</h1>
	<h2>Stats</h2>
	Attack / Spell Evade: ${(attackevade * 100).trim(2)}% / ${(spellevade * 100).trim(2)}%<br>
	Block Mitigation: ${(block_mitigation * 100).trim(1)}%<br>
	Hit: ${hits}<br>
	<h2>Extra</h2>
	Sheet Accuracy: ${Math.round(sheetacc)}`
}

/* old event switch */

function eventswitch(e) {
    switch (e.type) {
        case "keydown":
            if (e.key == "Tab") {
                e.preventDefault()
                if (input_focus === undefined) {
                    input_focus = 0
                    inputs_div[input_focus].classList.add("selected")
                } else {
                    inputs_div[input_focus].classList.remove("selected")
                    input_focus = (input_focus + 1) % inputs_div.length
                    inputs_div[input_focus].classList.add("selected")
                }
            }
            break

        case "click":
            let found

            inputs_div.forEach((c, i) => {
                if (e.target == c) {
                    found = i
                }
            })

            if (found != undefined) {
                if (found != input_focus) {
                    if (input_focus != undefined) {
                        inputs_div[input_focus].classList.remove("selected")
                        input_focus = found
                        inputs_div[input_focus].classList.add("selected")
                    } else {
                        input_focus = found
                        inputs_div[input_focus].classList.add("selected")
                    }
                }
            } else if (input_focus) {
                inputs_div[input_focus].classList.remove("selected")
                input_focus = undefined
            }

            break

        case "blur":
            if (input_focus != undefined) {
                inputs_div[input_focus].classList.remove("selected")
                input_focus = undefined
            }
            break
        default:
            console.log(`event switch default: ${e}`, e)
    }
}