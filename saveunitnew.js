var weaponCounter =0;
var specialCounter =0;

document.getElementById("save_new").addEventListener("click", function() {
    
    let name = document.getElementById("in_name_new").value;
    let defense = document.getElementById("in_defense_new").value;
    let lives = document.getElementById("in_lives_new").value;
    let notes = document.getElementById("in_notes_new").value;

    //console.log(name+attack+attackap+melee+meleeap+defense+notes);

    let table = document.getElementById("in_weapons");
    let weapons = Array.from(table.querySelectorAll("tr"));
    let newWeapons = [];
    
    for (let i in weapons){
        let weapon = {};
        console.log("weapons: " + weapons[i].querySelector("input[name=nombre]").id);
        const index = weapons[i].querySelector("input[name=nombre]").id.replace("weaponName","");
        weapon.name = document.getElementById("weaponName"+index).value;
        weapon.ismelee = document.getElementById("ismelee"+index).checked;
        weapon.hit = document.getElementById("hit"+index).value;
        weapon.attacks = document.getElementById("attacks"+index).value;
        weapon.damage = document.getElementById("damage"+index).value;
        weapon.ap = document.getElementById("ap"+index).value;
        newWeapons.push(weapon);
    }

    let table2 = document.getElementById("in_specials");
    let specials = Array.from(table2.querySelectorAll("tr"));
    let newSpecials = [];

    for (let i in specials){
        let special = specials[i];
        const index = specials[i].querySelector("input[name=specialNombre]").id.replace("specialName","");
        console.log(special);
        special.name = document.getElementById("specialName"+index).value;
        special.description = document.getElementById("specialDescription"+index).value;
        newSpecials.push(special);
    }

    let unit = [
        {
            "name":name,
            "attack":newWeapons,
            "defense":defense,
            "specials": newSpecials,
            "lives":lives,
            "notas":notes
        }
    ];

    fillTable(unit);
});

document.getElementById("in_special_new").addEventListener("click", () => {
    specialCounter += 1;
    let newSpecial = document.getElementById("in_specials");
    let newRow = document.createElement("tr");
    let newSpecialName = document.createElement("input");
    newSpecialName.setAttribute("id","specialName"+specialCounter);
    newSpecialName.setAttribute("name","specialNombre");
    let newSpecialDescription = document.createElement("textarea");
    newSpecialDescription.setAttribute("id","specialDescription"+specialCounter);
    let newSpecialDelete = document.createElement("button");
    newSpecialDelete.appendChild(document.createTextNode("Borrar"));
    newSpecialDelete.setAttribute("id","Borrar"+specialCounter);
    newSpecialDelete.addEventListener("click", () => {
        newSpecialDelete.parentElement.remove();
    })
    newRow.appendChild(newSpecialName);
    newRow.appendChild(newSpecialDescription);
    newRow.appendChild(newSpecialDelete);
    newSpecial.appendChild(newRow);
})

document.getElementById("in_attackNewRow").addEventListener("click", function(){
    weaponCounter += 1;
    let newAttack = document.getElementById("in_weapons");
    let newRow = document.createElement("tr");

    let newAttackName = document.createElement("input")
    newAttackName.setAttribute("type","text");
    newAttackName.setAttribute("name","nombre");
    newAttackName.setAttribute("id","weaponName"+weaponCounter);
    newAttackName.setAttribute("placeholder","Nombre");
    newRow.appendChild(newAttackName);

    let newAttackIsMeleeLabel = document.createElement("label");
    newAttackIsMeleeLabel.appendChild(document.createTextNode(" Melee:"));
    newRow.appendChild(newAttackIsMeleeLabel);

    let newAttackIsMelee = document.createElement("input");
    newAttackIsMelee.setAttribute("type","checkbox");
    newAttackIsMelee.setAttribute("id","ismelee"+weaponCounter);
    newRow.appendChild(newAttackIsMelee);

    let newAttackHit = document.createElement("input");
    newAttackHit.setAttribute("type","number");
    newAttackHit.setAttribute("id","hit"+weaponCounter);
    newAttackHit.setAttribute("placeholder","Hit");
    newRow.appendChild(newAttackHit);

    let newAttackAttacks = document.createElement("input");
    newAttackAttacks.setAttribute("type","number");
    newAttackAttacks.setAttribute("placeholder","Ataques");
    newAttackAttacks.setAttribute("id","attacks"+weaponCounter);
    newRow.appendChild(newAttackAttacks);

    let newAttackDamage = document.createElement("input");
    newAttackDamage.setAttribute("type","number");
    newAttackDamage.setAttribute("placeholder","Daño");
    newAttackDamage.setAttribute("id","damage"+weaponCounter);
    newRow.appendChild(newAttackDamage);

    let newAttackAP = document.createElement("input");
    newAttackAP.setAttribute("type","number");
    newAttackAP.setAttribute("placeholder","AP");
    newAttackAP.setAttribute("id","ap"+weaponCounter);
    newRow.appendChild(newAttackAP);

    let newAttackDelete = document.createElement("button");
    newAttackDelete.appendChild(document.createTextNode("Borrar"));
    newAttackDelete.setAttribute("id","Borrar"+weaponCounter);
    newAttackDelete.addEventListener("click", () => {
        newAttackDelete.parentElement.remove();
    })
    newRow.appendChild(newAttackDelete);
    newAttack.appendChild(newRow);
})

function isEven(number){
    return true ? number % 2 === 0 : false;
}