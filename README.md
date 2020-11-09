# kyfb
*Know your food business*

## Structure
The structure of the KYFB is a little different than label buster.
However, it has to conform to most of the same way of doing things so we could
re-use a lot of the same functionality. To that end, we added to the index file the ability to load and unload forms.

The structure then of the KYFB app is as follows:
* Formio as the form CMS
* Formio wrapper as the communication with Formio
* Button group for the navigation
* Topics list to allow the user navigation between forms

## Formio
Form.io is one way to quickly create modify and update forms on the fly. Like other similar technologies, it focuses on the submission and treatment of the data for these also. However, for the scope of the KYFB and LabelBuster, this functionality is limited only to the display of the forms.

## Wrapper
The wrapper is designed to de-couple the application away from Formio, allowing swappable form solutions in the future and to simplify the rest of the application and not have to deal with the way Formio works directly while dealing with the application logic. This helps to enforce the single responsibility principle. Much of this is configurable to cater to the individual needs of the application allowing for full re-use of this wrapper. 

Update when wrapper is moved to own repo and describe the config when its fully solidified.


## Button Group 
The button group controls the navigation of an individual form. It listens to the form updated trigger from the wrapper which includes all the data needed to build the navigation on the left and to build the buttons to go next, back, and cancel.

## Topics List
The topics list is a list of pre-defined topics displayed in a certain fashion. Rather than hardcoded, this needs to be dynamic based on the user’s previous choices. Also, this list needs to be injected into the last view of the Formio form.

## Improvements
The following code needs to be improved, ideally sooner rather than later.
* The index shouldn’t have “show” and “hide” when we can use lit-html syntax to do the same thing much more elegantly.
* Formio wrapper needs to be moved to npm and used as a dependency
* Navigation code should be treated as a separate dependency and pulled from GitHub in the build.
* Code coverage needs to be improved.
* Reapply selected needs unit tests
* Configuration needs cleaning up.
* Button group might need to be improved to handle print/pdf
