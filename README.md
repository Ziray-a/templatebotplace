# r/place Bot for the r/furry_irl alliance
If you see this you are one of the few chosen ones to be included in this dump
sorry not sorry

## Admin Commands

`prefixsetcanvas <x> <y>`

Changes the canvas size

`<prefix>addadmin`

Adds an Admin to the settings AdminID list,
Managers are the highest administrative level

`<prefix>setcanvas <x> <y>`

Used when the canvas gets set to another pixel size

`<prefix>addmanager`

Used to add a manager to the settings ManID list.
Managers are the next administrative level below Admin

`<prefix>remmanager`

Removes managers from the settings ManID list.


## Manager Commands
*can also be used my admins*


`<prefix>getSubs`

shows all subs currently managed

`<prefix>getToggled`

shows all toggled templates for bot and overlay

`<prefix>gist`

pushes newest template from the overlay channel to a gist


`<prefix>OverlayOff <sub>` 
>Manager Mode

deactivates the user overlay for a singular sub, has no restrictions

`<prefix>OverlayOn <sub>`
>Manager Mode

activates the user overlay for a singular sub, has no restrictions

`<prefix>BotOff <sub>`
>Manager Mode

deactivates the bot overlay for a singular sub, has no restrictions

`<prefix>BotOn <sub>`
>Manager Mode

activates the user overlay for a singular sub, has no restrictions

`<prefix>AddSub <sub>`
>Requires an Image uploaded

Adds a sub to the list of already existing subs, the additional uploaded image is used
to asign space to said sub

`<prefix>RemSub <sub>`

Removes a Subreddit from the list of already existing subs

`<prefix>updateTemplate <sub>`
>Manager Mode

>Requires an Image uploaded

This one will either update an existing Template without errors, or will query you to confirm a change
if the Size, position or number of alocated pixels is different from before (this will override pixels make sure to check that it doesnt encroach on anyones template), THIS IS THE ONLY WAY TO asign additional pixels 

`<prefix>AddRep <sub> <@mention>`

Adds a representative to the respective sub 

`<prefix>RemRep <sub> <@mention>`

removes a representative to the respective sub 

## Rep Commands
*weakened versions of manager commands*

`<prefix>updateTemplate <sub>`
>Requires an Image uploaded

updates Template, cannot override size

`<prefix>OverlayOff <sub>` 

deactivates the user overlay for a singular sub,
only works for subs you represent

`<prefix>OverlayOn <sub>`

activates the user overlay for a singular sub, 
only works for subs you represent

`<prefix>BotOff <sub>`

deactivates the bot overlay for a singular sub,
only works for subs you represent

`<prefix>BotOn <sub>`

deactivates the bot overlay for a singular sub,
only works for subs you represent


## Public commands
`<prefix> getTemplate <sub>`

Will fetch the Template of the sub mentioned
