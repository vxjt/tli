import './magoo.js'

import { cleanhtml } from './magoo.js'

var input_divs
var list_divs
var autosave = false // change

var data = {
	invincible: {
		resistance: 0.49, // 0.7945
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
	},
}

var sheet = {
	skill: {
		items: {},
		name: "Skill",
		type: "list",
	},
	weapon: {
		items: {
			physical_damage: {
				name: "Physical Damage",
			},
			critical_rating: {
				name: "Critical Strike Rating",
			},
			attack_speed: {
				name: "Attack Speed",
				figs: 2,
			},
		},
		name: "Weapon",
		type: "dual-group",
		name_toggle: "Dual Wield",
		default: true,
	},
}

var results = {
	char_title: {
		name: "Character Sheet",
		type: "h2",
	},
	base_title: {
		name: "Base",
		type: "h3",
	},
	dps: {
		name: "DPS",
	},
	survival: {
		name: "Survival",
	},
	stats_title: {
		name: "Stats",
		type: "h4",
	},
	damage_title: {
		name: "Damage",
		type: "h3",
	},
	survival_title: {
		name: "Survival",
		type: "h3",
	},
	others_title: {
		name: "Others",
		type: "h3",
	},
}

init()
calc()
draw_results()

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
							<input autocomplete="off" id="${key}" type="text" class="input-list">▼
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

	document.addEventListener("visibilitychange", eventswitch)

	for (let a of list_divs) {
		a.addEventListener("mousedown", eventswitch, { passive: true })
	}
}

function calc() {
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

		case "visibilitychange":
			if (document.visibilityState == "hidden" && autosave) {
				localStorage.setItem("sheet", JSON.stringify(sheet))
			}
			break
	}
}