# Future

- input validation
- list, text input
- list, better selection indicator -- icon?
- list, down arrow redesign
- checkbox, redesign -- circle?
- label and name are similar variables
- trim fix
- saving is broken
- design for zoom in

- Show 'Damage Value' stats ?

# Input

## List

Display suggested items on `:focus`

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

## Text

Align left

## Number

Align right

## Group

```
 _ Group Name ______________________________
| 											|
| Label			[50%]	Input	|	Input2	|
| ...							|			|
| Toggle Label	[50%]	Toggle	|			|
|___________________________________________|
```

# Calculator

## Input

Weapon has three stats: Physical Damage, Critical Strike Rating and Attack Speed

## Evasion

Enemy accuracy, $ 130 \leq a \leq 680 $  
Evade rate, $ 0 \leq v \leq 0.75 $
$$ {attack \  v} = 1 - \frac {1.15a} {a + 0.5 x ^ {3 / 4}} $$
$$ {spell \  v} = 1 - \frac {1.15a} {a + 0.5 (0.6 x) ^ {3 / 4}} $$
$$ a = \frac {x ^ {3 / 4} ( 0.5 - 0.5v )} {v + 0.15} $$

## Numbed

Numbed increases lightning damage by 5% per stack for 2s.

New stacks seem to only come from unique sources.

Thunder Strike seems to alternate between 1 and 2 base stacks from the 1 stack/s from shadows.  The stack is refreshed when the next hit happens after the 1s cooldown.

# Packages

Git.Git
OpenJS.NodeJS

# CSS

justify-content: normal is stretch which is flex-start