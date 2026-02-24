# Evasion

Enemy accuracy, $ 130 \leq a \leq 680 $  
Evade rate, $ 0 \leq v \leq 0.75 $
$$ {attack \  v} = 1 - \frac {1.15a} {a + 0.5 x ^ {3 / 4}} $$
$$ {spell \  v} = 1 - \frac {1.15a} {a + 0.5 (0.6 x) ^ {3 / 4}} $$
$$ a = \frac {x ^ {3 / 4} ( 0.5 - 0.5v )} {v + 0.15} $$

# Numbed

Numbed increases lightning damage by 5% per stack for 2s.

New stacks seem to only come from unique sources.

Thunder Strike seems to alternate between 1 and 2 base stacks from the 1 stack/s from shadows.  The stack is refreshed when the next hit happens after the 1s cooldown.

# Future

- Input validation
- Model basic stats
- Expand notes
- Refactor general layout code
- Dropdown list
- Allow inputs to be inline and add line break logic from results
- Header logic
- Read more about imports
- Redo stat bonus calc
- Show 'Damage Value' stats
- Trim revamp based on numbers visible
- Format functions
- Redo flextable
- Fix clear data
- Saving needs to only save values
- Buttons need to be taller

# Maybe

- List ... & button highlight
- label and name are similar variables

# Text Input

should look more like the number input

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

Input
    Number
        align right
    Text
        align left
        list of values

\<Label> \<space> \<Field, number/text>

# Packages

Git.Git
OpenJS.NodeJS