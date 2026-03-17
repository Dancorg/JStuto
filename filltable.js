var units = [];

let intern = Object;
document.getElementById("loadfile").addEventListener("change", function() {
    let file_to_read = document.getElementById("loadfile").files[0];
    let fileread = new FileReader();
    fileread.onload = function(e) {
        let content = e.target.result;
        console.log(content);
        intern = JSON.parse(content); // Array of Objects.
        fillTable(intern.units);
        };
    fileread.readAsText(file_to_read);
});

let rowToDelete = "";

let deletePopover = document.getElementById("delete");
console.log(deletePopover)
deletePopover.addEventListener("click", function(){
    document.getElementById(rowToDelete+"A").parentElement.parentElement.remove();
    Unit.deleteUnit(rowToDelete);
    deletePopover.parentElement.hidePopover();
})

function fillTable(list){
    console.log("new units: " + JSON.stringify(list));
    list.forEach(element => {
        units.push(new Unit(element.name, element.attack, element.defense, element.lives, element.specials ,element.notas));
    });
};

class Unit{
    constructor(name, attacks, defense, lives, specials, notes){
        let repeatCounter = 1;
        this.name = name;
        while(Unit.findUnitIndexByName(this.name) != -1){this.name = name + "_" + repeatCounter++};
        this.attack = attacks;
        console.log("armas: " + JSON.stringify(this.attack));
        this.defense = defense;
        this.totalLives = this.lives = lives;
        this.notas = notes;
        this.specials = this.createSpecials(specials);
        this.suppressed = false;
        this.active = true;
        this.posture = 'defend';
        this.attacker = false;
        this.wounded = false;
        console.log(name);
        this.createRow();
    }

    createAttacks(attacks){ //no usar?
        let attackList = [];
        for(element in attacks){
            let newAttack = new Attack(element.name, element.ismelee, element.attacks, element.hit, element.ap);
            attackList.push(newAttack);
        }
    }

    createSpecials(specials){
        let specialsList = [];
        for (let i in specials){
            specialsList.push(specials[i]);
        }
        this.canBeWounded = specials.canBeWounded || true;
        this.canBeSuppressed = specials.canBeSuppressed || true;
        this.teamShield = specials.teamShield || false;
        this.medic = specials.medic || false;
        this.mechanic = specials.mechanic || false;
        this.stealthy = specials.stealthy || false;
        return specialsList;
    }

    updateCell(cell){
        return;
    }

    deleteRow(){
        return;
    }

    static deleteUnit(name){
        let removed = units.splice(Unit.findUnitIndexByName(name),1);
        console.log("Unit removed: " + JSON.stringify(removed));
    }

    applyEffect(){
        return;
    }

    findWeaponByWeaponName(weaponName){
        return this.attack.find(item => item.name == weaponName.replace(this.name,''));
    }

    static findUnitIndexByName(name){
        return units.findIndex(a => a.name == name);
    }

    static findUnitByWeaponName(weaponName){
        console.log("buscando: " + weaponName);
        return units.find(obj => obj.attack.some(item => item.name == weaponName.replace(obj.name,'')));
    }

    static listUnits(){
        return JSON.stringify(units);
    }

    createRow(){
        let tabla = document.getElementById("unitList");
        let newrow = document.createElement("tr");
        newrow.setAttribute("class","row");

        let newnamea = document.createElement("th");
        newnamea.setAttribute("class","canActivate");
        let colorSwitch = document.createElement("button");
        colorSwitch.setAttribute("class","buttonHidden");
        colorSwitch.addEventListener("click",()=>{
            if(newnamea.className == "canActivate"){
                console.log("Activate: "+newnamea.className);
            newnamea.className = "activated";}else{
                console.log("canActivate: "+newnamea.className);
                newnamea.className = "canActivate";
            };
        });
        let newnameavalue = document.createTextNode(this.name);
        let newnameadeleteplaceholder = document.createElement("th")
        newnameadeleteplaceholder.setAttribute("id",this.name + "A"); //legacy for row delete
        newnamea.appendChild(colorSwitch);
        newnamea.appendChild(newnameavalue);
        newnamea.appendChild(newnameadeleteplaceholder);
        newrow.appendChild(newnamea);
        
        let newattackcell = document.createElement("th");
        let newattacktable = document.createElement("table");

        let labelsRow = document.createElement("tr");
        labelsRow.setAttribute("class","weaponLabels");
        let labelsName = document.createElement("th");
        labelsName.appendChild(document.createTextNode("Arma"));
        let labelsMelee = document.createElement("th");
        labelsMelee.appendChild(document.createTextNode("Melee?"));
        let labelsHit = document.createElement("th");
        labelsHit.appendChild(document.createTextNode("Hit"));
        let labelsAttacks = document.createElement("th");
        labelsAttacks.appendChild(document.createTextNode("Ataques"));
        let labelsDamage = document.createElement("th");
        labelsDamage.appendChild(document.createTextNode("Daño"));
        let labelsAp = document.createElement("th");
        labelsAp.appendChild(document.createTextNode("AP"));
        
        labelsRow.appendChild(labelsName);
        labelsRow.appendChild(labelsMelee);
        labelsRow.appendChild(labelsHit);
        labelsRow.appendChild(labelsAttacks);
        labelsRow.appendChild(labelsDamage);
        labelsRow.appendChild(labelsAp);
        newattacktable.appendChild(labelsRow);

        for (let i in this.attack){
            let profile = this.attack[i];
            let id = this.name + profile.name;
            console.log(profile.name);
            let newProfileRow = document.createElement("tr");
            let newProfileName = document.createElement("th");
            let newProfileInput = document.createElement("input");
            newProfileInput.setAttribute("id", id);
            newProfileInput.setAttribute("type", "radio");
            newProfileInput.setAttribute("name", "attacker");
            newProfileInput.addEventListener("click", () => {document.getElementById("dice").value = profile.attacks});
            let newProfileLabel = document.createElement("label");
            newProfileLabel.setAttribute("class", "weaponLabel");
            newProfileLabel.setAttribute("for", id);
            newProfileLabel.appendChild(document.createTextNode(profile.name));
            newProfileName.appendChild(newProfileInput);
            newProfileName.appendChild(newProfileLabel);
            
            let newProfileIsMelee = document.createElement("input");
            newProfileIsMelee.setAttribute("type", "checkbox");
            newProfileIsMelee.setAttribute("class", "weaponLabel");
            newProfileIsMelee.checked = profile.ismelee;
            newProfileIsMelee.disabled = true;

            let newProfileHit = document.createElement("th");
            newProfileHit.setAttribute("id", id + "Hit");
            newProfileHit.setAttribute("class", "weaponLabel");
            newProfileHit.appendChild(document.createTextNode(profile.hit));
            let newProfileAttacks = document.createElement("th");
            newProfileAttacks.setAttribute("id", id + "Attacks");
            newProfileAttacks.setAttribute("class", "weaponLabel");
            newProfileAttacks.appendChild(document.createTextNode(profile.attacks));
            let newProfileDamage = document.createElement("th");
            newProfileDamage.setAttribute("id", id + "Damage");
            newProfileDamage.setAttribute("class", "weaponLabel");
            newProfileDamage.appendChild(document.createTextNode(profile.damage));
            let newProfileAP = document.createElement("th");
            newProfileAP.setAttribute("id", id + "AP");
            newProfileAP.setAttribute("class", "weaponLabel");
            newProfileAP.appendChild(document.createTextNode(profile.ap));

            newProfileRow.appendChild(newProfileName);
            newProfileRow.appendChild(newProfileIsMelee);
            newProfileRow.appendChild(newProfileHit);
            newProfileRow.appendChild(newProfileAttacks);
            newProfileRow.appendChild(newProfileDamage);
            newProfileRow.appendChild(newProfileAP);
            newProfileRow.style.backgroundColor = isEven(i) ? "lightgray" : "white";
            newattacktable.appendChild(newProfileRow);
        };

        newattackcell.appendChild(newattacktable);
        newrow.appendChild(newattackcell);

        let newdefense = document.createElement("th");
        newdefense.setAttribute("id", this.name+"Dde");
        newdefense.appendChild(document.createTextNode(this.defense));
        newrow.appendChild(newdefense);

        let newnamed = document.createElement("th");
        let newnamedinput = document.createElement("input");
        newnamedinput.setAttribute("id",this.name+"D");
        newnamedinput.setAttribute("type","radio");
        newnamedinput.setAttribute("name", "defender");
        let newnamedlabel = document.createElement("label");
        newnamedlabel.setAttribute("for",this.name+"D");
        let newnamedvalue = document.createTextNode(this.name);
        newnamedlabel.appendChild(newnamedvalue);
        newnamed.appendChild(newnamedinput);
        newnamed.appendChild(newnamedlabel);
        newrow.appendChild(newnamed);

        let vidasCell = document.createElement("th");
        let vidas = document.createElement("input");
        vidas.setAttribute("id", this.name + "Dvi");
        vidas.setAttribute("type", "number");
        vidas.setAttribute("value",this.lives);
        vidasCell.appendChild(vidas);
        newrow.appendChild(vidasCell);

        let posturaCell = document.createElement("th");
        let inMoveRow = document.createElement("tr");
        let inMoveRadio = document.createElement("input");
        inMoveRadio.setAttribute("id", this.name + "InMove");
        inMoveRadio.setAttribute("type", "radio");
        inMoveRadio.setAttribute("name",this.name + "Posture");
        let inMoveLabel = document.createElement("label");
        inMoveLabel.appendChild(document.createTextNode("En movimiento"));
        inMoveLabel.setAttribute("for",this.name + "InMove");
        inMoveRow.appendChild(inMoveRadio);
        inMoveRow.appendChild(inMoveLabel);

        let inDefenseRow = document.createElement("tr");
        let inDefenseRadio = document.createElement("input");
        inDefenseRadio.setAttribute("id", this.name + "InDefense");
        inDefenseRadio.setAttribute("type", "radio");
        inDefenseRadio.setAttribute("name",this.name + "Posture");
        let inDefenseLabel = document.createElement("label");
        inDefenseLabel.appendChild(document.createTextNode("En defensa"));
        inDefenseLabel.setAttribute("for",this.name + "InDefense");
        inDefenseRow.appendChild(inDefenseRadio);
        inDefenseRow.appendChild(inDefenseLabel);

        let inAmbushRow = document.createElement("tr");
        let inAmbushRadio = document.createElement("input");
        inAmbushRadio.setAttribute("id", this.name + "InAmbush");
        inAmbushRadio.setAttribute("type", "radio");
        inAmbushRadio.setAttribute("name",this.name + "Posture");
        let inAmbushLabel = document.createElement("label");
        inAmbushLabel.appendChild(document.createTextNode("En emboscada"));
        inAmbushLabel.setAttribute("for",this.name + "InAmbush");
        inAmbushRow.appendChild(inAmbushRadio);
        inAmbushRow.appendChild(inAmbushLabel);

        let inMeleeRow = document.createElement("tr");
        let inMeleeRadio = document.createElement("input");
        inMeleeRadio.setAttribute("id", this.name + "InMelee");
        inMeleeRadio.setAttribute("type", "radio");
        inMeleeRadio.setAttribute("name",this.name + "Posture");
        let inMeleeLabel = document.createElement("label");
        inMeleeLabel.appendChild(document.createTextNode("En melee"));
        inMeleeLabel.setAttribute("for",this.name + "InMelee");
        inMeleeRow.appendChild(inMeleeRadio);
        inMeleeRow.appendChild(inMeleeLabel);

        posturaCell.appendChild(inMoveRow);
        posturaCell.appendChild(inDefenseRow);
        posturaCell.appendChild(inAmbushRow);
        posturaCell.appendChild(inMeleeRow);
        newrow.appendChild(posturaCell);

        let stateCell = document.createElement("th");
        let woundedRow = document.createElement("tr");
        let woundedCheck = document.createElement("input");
        woundedCheck.setAttribute("type","checkbox");
        let woundedLabel = document.createElement("label");
        woundedLabel.appendChild(document.createTextNode("Herido"));
        woundedRow.appendChild(woundedLabel);
        woundedRow.appendChild(woundedCheck);
        stateCell.appendChild(woundedRow);
        let suppressedRow = document.createElement("tr");
        let suppressedCheck = document.createElement("input");
        suppressedCheck.setAttribute("type","checkbox");
        let suppressedLabel = document.createElement("label");
        suppressedLabel.appendChild(document.createTextNode("Supreso"));
        suppressedRow.appendChild(suppressedLabel);
        suppressedRow.appendChild(suppressedCheck);
        stateCell.appendChild(suppressedRow);
        newrow.appendChild(stateCell);

        /*this.specials = [
            {"name":"Bruto","description":"Ataque pesado en carga"},
            {"name":"Cazador","description":"Preciso en emboscada"},
            {"name":"Explosivo","description":"Ataque a oponentes adyacentes al morir"},
        ];*/

        let especialCell = document.createElement("th");
        for(let i in this.specials){
            const spec = this.specials[i];
            let specialRow = document.createElement("tr");
            specialRow.appendChild(document.createTextNode(spec.name));
            let specialPopover = document.createElement("div");
            specialRow.addEventListener("click",(event) => {
                specialPopover.togglePopover();
                placePopover(specialPopover, event);
            });
            specialPopover.setAttribute("popover","");
            specialPopover.setAttribute("id",this.name+spec.name);
            specialPopover.appendChild(document.createTextNode(spec.description));
            especialCell.appendChild(specialPopover);
            especialCell.appendChild(specialRow);
        }
        newrow.appendChild(especialCell);

        let notasCell = document.createElement("th");
        let notas = document.createElement("input");
        notas.setAttribute("value",this.notas);
        notas.setAttribute("class", "notas");
        notasCell.appendChild(notas);
        newrow.appendChild(notasCell);

        let borrar = document.createElement("th");
        let borrarButton = document.createElement("button");
        borrarButton.setAttribute("id",this.name+"Del");
        borrarButton.setAttribute("popovertarget", "confirmDelete");
        borrarButton.setAttribute("name",this.name);
        let trashicon = document.createTextNode("🗑️");
        borrarButton.appendChild(trashicon);
        console.log(this.name);
        borrarButton.addEventListener("click", (event) => {
            rowToDelete = this.name;
            
            let popover = document.getElementById("confirmDelete");
            placePopover(popover, event);
            
            //console.log(event.clientX + " " + event.clientY);
        });
        borrar.appendChild(borrarButton);
        newrow.appendChild(borrar);

        tabla.appendChild(newrow);
    }
}

function placePopover(popover, event){
    popover.style.top = event.clientY*2 - window.innerHeight + 60;
    popover.style.left = event.clientX*2 - window.innerWidth;
}

class Attack{
    constructor(name, ismelee, attacks, hit, ap, specials){
        this.name = name;
        this.ismelee = ismelee;
        this.attacks = attacks;
        this.hit = hit;
        this.ap = ap;
        this.heavyOnCharge = specials.heavyOnCharge || false;
        this.preciseOnAmbush = specials.preciseOnAmbush || false;
        this.preciseOnDefense = specials.preciseOnDefense || false;
        this.preciseOnMelee = specials.preciseOnMelee || false;
    }
}

function addRow(table, row){
    let newrow = document.createElement("tr");
    let columns = Object.keys(row);
    columns.forEach(element => {
        let newcell = document.createElement("th");
        if(typeof(row[element])=="object"){
            row[element].forEach(obj => {
                //console.log(obj);
                attrlist = Object.keys(obj);
                attrlist.forEach(attr => {
                    //console.log(attr);

                });
            });
        }else{
            //console.log(row[element]);
            newcell.appendChild(document.createTextNode(row[element]));
        };
        newrow.appendChild(newcell);
    });
    table.appendChild(newrow);
};

        