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
The effect is 1 / 2 / 1 / 2.. 
Doesn't seem to scale with attack speed.

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

# WinGet

Git.Git
OpenJS.NodeJS