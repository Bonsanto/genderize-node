# genderize-node
<hr/>
A small application that requests names and stores the gender in a CSV using the genderize.io API.


## Source DataSet (cne)
<hr/>
The DataSet used is on the *cne* database which comes from the *nacional.csv*. It has **todo**

- nacionalidad, a ```varchar(2)``` of one character that represents if the citizen is venezuelan or not.  
- cedula, a ```numeric identifier``` of the elector.
- primer_apellido, a ```varchar``` field that stores the last name of the elector.
- segundo_apellido, a ```varchar``` field that stores the mother's maiden name or second last name.
- primer_nombre, a ```varchar``` field that stores the first name of the elector.
- segundo_nombre, a ```varchar``` field that stores the middle name of the elector.
- cod_centro, a ```numeric``` identifier used to represent where the elector votes.


## Target DataSet (cne_depurado)
<hr/>
The Target DataSet is a tidied up and cleaned version of the Source DataSet will have only four fields.

- cedula, a ```numeric``` field used as identifier of the elector.
- primer_nombre, a ```varchar``` field that stores the first name of the elector.
- segundo_nombre, a ```varchar``` field that stores the middle name of the elector.
- genero, a ```varchar(2)``` field that stores the gender of the name, after being requested to the genderize.io API.

### Depuration cases
<hr/>
The names that will be ***fixed*** are those with these characteristics:

1. Names with spaces on the beggining or end of the ```string```. Those string will be trimmed.
2. Names with specials characters ```[+-.,!@#$%^&*();\/|<>"]``` except the symbol ```'```. Those symbols will be replaced with an empty character.
   - If the name has a ```'``` it will be kept that way.
3. Names with spaces between two words. This case requires a different treatment:
   - If the name has a stopword like **santa, san, santo, santas, santos, ...** the stopword will be replaced with an empty string .
   - If the name has a stopword like **a, de, del, el, los, la, las, ...** the stopword will be replaced with an empty string.