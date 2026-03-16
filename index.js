
const resolveBtn = document.getElementById('resolveButton');
resolveBtn.onclick = function() {runResult()};

function runResult(){
    let attacks = Number(document.getElementById("dice").value);
    let result = document.getElementById("result");
    result.textContent = "";
    let attackMod4 = 1; //attacks
    if (document.querySelector("#tiredA:checked")){attackMod4 *= 0.66};
    console.log("attaks mod: " + attackMod4);
    const calculatedAttacks = Math.ceil(attacks*=attackMod4);

    for (i = 0; i<calculatedAttacks; i++){
        computeResult();
    }
}

function computeResult(){
    let result = document.getElementById("result");

    if (document.querySelector("input[name=attacker]:checked") == null){
        result.textContent="Seleccionar Atacante";
        return
    }   
    if (document.querySelector("input[name=defender]:checked") == null){
        result.textContent="Seleccionar Defensor";
        return
    }

    let ismelee = document.querySelector("#melee:checked") ? true : false ;
    console.log(ismelee);

    let attacker = document.querySelector("input[name=attacker]:checked").id;
    let attackerObject = Unit.findUnitByWeaponName(attacker);
    /*if(attackerObject){attacker = attackerObject.findWeaponByWeaponName(attacker).name};
    console.log(attacker);*/
    let defender = document.querySelector("input[name=defender]:checked").id;

    var attackerAttack , attackerDamage, attackerAp;

    if(attackerObject){
        attackerAttack = Number(document.querySelector("#"+attacker+"Hit").innerHTML);
        attackerAp = Number(document.querySelector("#"+attacker+"AP").innerHTML);
        attackerDamage = Number(document.querySelector("#"+attacker+"Damage").innerHTML);
    }
    else{
        if (ismelee) {
            attackerAttack = Number(document.querySelector("#"+attacker+"mat").innerHTML);
            attackerAp = Number(document.querySelector("#"+ attacker +"map").innerHTML);
        }else{
            attackerAttack = Number(document.querySelector("#"+attacker+"at").innerHTML);
            attackerAp = Number(document.querySelector("#"+ attacker +"ap").innerHTML);
        }
    };
    
    let attackMod1 = 0; //hit
    let attackMod2 = 0; //ap
    let attackMod3 = 1; //damage
    
    if (document.querySelector("#accurateA:checked")){attackMod1 += 2};
    if (document.querySelector("#inaccurateA:checked")){attackMod1 -= 2};
    if (document.querySelector("#hardA:checked")){attackMod3 *= 0.5};
    
    if (document.querySelector("#heavyA:checked")){attackMod2 += 2};
    console.log("hit mod: " + attackMod1);
    console.log("heavy mod: " + attackMod2);
    console.log("damage mod: " + attackMod3);
    let defenseMod = 0; //defense
    if (document.querySelector("#coverD:checked")){defenseMod = 2};
    console.log("defense mod: " + defenseMod);
    console.log("attacker attack " +attackerAttack);
    console.log("attacker ap " + attackerAp);
    // console.log("attacker defense " + attackerDefense);

    let defenderDefense = Number(document.querySelector("#"+ defender +"de").innerHTML);
    // console.log("defender attack " + defenderAttack);
    // console.log("defender ap " + defenderAp);
    console.log("defender defense " + defenderDefense);

    let attackRoll = Math.ceil(Math.random()*6);
    console.log("attack roll: " + attackRoll);
    let defenseRoll = Math.ceil(Math.random()*6);
    console.log("defense roll: " + defenseRoll);

    function isHit(attackRoll, attackMod1, attackerAttack){
        let outcomeH = '';
        if(attackRoll == 1) {outcomeH = false;} else
        if((attackRoll + attackMod1) >= attackerAttack) {outcomeH = true;}else
        if(attackRoll == 6) {outcomeH = true;}else
        {outcomeH = false;}
        if (outcomeH == false) result.textContent += "| Miss ";
        return outcomeH;
    }

    function isDefense(defenseRoll, defenseMod, defenseRoll, attackerAp, attackMod2){
        let outcomeD = '';
        if(defenseRoll == 1) {outcomeD = false;} else
        if(defenseRoll == 6) {outcomeD = true;}else
        if((defenseRoll + defenseMod) >= (defenderDefense+attackerAp+attackMod2)) {outcomeD = true;}else
        {outcomeD = false};
        if(outcomeD == true) result.textContent += "| Bloqueado ";
        return outcomeD;
    }

    /*if(
        (attackRoll != 1)
        &&
        (((attackRoll + attackMod1) >= attackerAttack) || attackRoll == 6) 
        &&
        (((defenseRoll + defenseMod) < (defenderDefense + attackerAp + attackMod2)) && defenseRoll != 6)
    )*/
    if(
        isHit(attackRoll, attackMod1, attackerAttack) 
        && 
        !isDefense(defenseRoll, defenseMod, defenseRoll, attackerAp, attackMod2)){
        console.log("attacker win");
        let vidas = document.querySelector("#"+defender+"vi").value -= Math.ceil(attackerDamage*attackMod3) || 1;
        result.textContent+="| Daño recibido:" + Math.ceil(attackerDamage*attackMod3) + " ";
        if(vidas <= 0){
            console.log("morido");
            var row = document.querySelector("input[name=defender]:checked").parentNode.parentNode;
            row.style.textDecoration = "line-through";
            row.style.color = "red";
        }

    }else{
        console.log("defender win");
    }
    result.setAttribute("class","resultActive");
    setTimeout(()=>result.setAttribute("class","result"),1);
}

document.getElementById("throwDie").addEventListener("click", ()=>{
    const resultDie = document.getElementById("dadoResult");
    resultDie.setAttribute("class","resultActive");
    setTimeout(()=>resultDie.setAttribute("class","result"),1);
});

document.getElementById("newTurn").addEventListener("click",()=>{
    let nameCells = document.querySelectorAll(".activated");
    nameCells.forEach((element)=>{
        element.className="canActivate";
    });
    let checkedAttacks = document.querySelectorAll("input[name=attacker]:checked, input[name=defender]:checked");
    checkedAttacks.forEach((e) => {
        e.checked = false;
    })
});