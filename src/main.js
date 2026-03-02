import { cleanhtml, gr_note } from "./magoo"

const box = document.querySelector("#box")

const button_clear = document.querySelector("#reset")

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
		name: "Skill",
		options: ["Thunder Spike"],
	},
}

/* init */

if (box.innerHTML === "") {
	box.innerHTML = `
	<div>Skill 1234</div>
	<div>Main Weapon Physical Damage 1234</div>
	<div>Main Weapon Attack Speed 1234</div>
	<div>Main Weapon Critical Rating 1234</div>`
}

box.addEventListener("beforeinput", event_beforeinput)
document.addEventListener("visibilitychange", event_visibilitychange)
button_clear.addEventListener("click", event_click)

/* functions */

function event_beforeinput(e) {
	switch (e.inputType) {
		case "insertText":
			/*e.preventDefault()
			box.innerHTML += e.data*/
			break
		case "deleteContentBackward":
			/*e.preventDefault()
			document.getSelection().deleteFromDocument()*/
			break
		default:
			console.log("beforeinput", e)
	}
}

function event_click(e) {
	//console.log(`clear data`)
}

function event_visibilitychange(e) {
	if (document.visibilityState == "hidden" && document.querySelector("#save").checked) {
		//console.log(`save`)
	}
}