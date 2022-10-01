let startButton = document.getElementById("startButton");
let data ;
let socket =null;



startButton.addEventListener("click", async () => {
    

    data = await execute_Function(()=>{

        // document.body.style.backgroundColor ='orange';
        const myDiv = document.createElement("div");
        const para = document.createElement("p");
        const text = document.createTextNode("New Entry");
        para.appendChild(text);
        myDiv.appendChild(para);
        document.body.appendChild(myDiv)
    },[]);
});


function parseTabDOM(doc){
    let tableDoc = doc.body.getElementsByClassName("table")[0];
    let gameInfoDoc = doc.body.getElementsByClassName("game-infos")[0];
    let Pot1 = tableDoc.getElementsByClassName("table-pot-size")[0].getElementsByClassName("main-value")[0].innerText
    let Pot2 = tableDoc.getElementsByClassName("table-pot-size")[0].getElementsByClassName("add-on-container ")[0].firstChild.lastChild.innerText;

    Pot1 = parseInt(Pot1);
    Pot2 = parseInt(Pot2);

    let tableCardsDoc = tableDoc.getElementsByClassName("table-cards run-1")[0].children ;
    let numTableCards = tableCardsDoc.length;
    let tableCardsArr = [];
    
    for(let i =0; i< numTableCards; i++){
        let tempCard = tableCardsDoc[i].getElementsByClassName("card")[0];
        tableCardsArr.push({
            value : tempCard.getElementsByClassName("value")[0].innerText,
            suit : tempCard.getElementsByClassName("suit sub-suit")[0].innerText
        });
    }

    let seatsDoc = tableDoc.getElementsByClassName("seats")[0].children;
    let selfSeatDoc = seatsDoc[1];
    let selfCardsDoc = seatsDoc[1].getElementsByClassName("card");
    let selfCardsArr= [];

    for( let i =0 ; i<2; i++){
        selfCardsArr.push({
            value: selfCardsDoc[i].getElementsByClassName("value")[0].innerText,
            suit : selfCardsDoc[i].getElementsByClassName("suit sub-suit")[0].innerText
        });
    }

    let numSeats = seatsDoc.length-1;

    let messageData = {
        numSeats : numSeats,
        tableCards : tableCardsArr,
        selfCards : selfCardsArr

    };
    socket.send(JSON.stringify(messageData));

    // for(let i =1; i< numSeats; i++){
        // let tempSeat= seatsDoc[i];
    // }

    

}
function updateUI (win, loss, tie){
    let winText = document.getElementById("win");
    let lossText = document.getElementById("loss");
    let tieText = document.getElementById("tie");

    winText.innerHTML = "Wins : "+win.toFixed(2).toString()+ " %";
    lossText.innerHTML = "Loss : "+loss.toFixed(2).toString()+ " %";
    tieText.innerHTML = "Ties : "+tie.toFixed(2).toString()+ " %";

}

function getActiveTab(tabCallBack){
    chrome.tabs.query(
        {currentWindow: true, active : true},
        function(tabArray){tabCallBack(tabArray[0]);}
      );
}
async function getTabDOM(){

    let retDataString = (await getTabDOM_Promise())[0]['result'];
    // console.log(retDataString);
    let parser = new DOMParser();
    let retDataDoc = parser.parseFromString(retDataString,"text/html");
    // console.log(retDataDoc);
    return retDataDoc;
}

function getTabDOM_Promise() {
    return new Promise((resolve, reject) => {
        getActiveTab((tab)=>{
            chrome.scripting.executeScript(
                {
                    target : {tabId: tab.id},
                    func: () => {
                        // console.log(document);
                        let parser = new XMLSerializer();
                        return(parser.serializeToString(document.body) );
                }},
                (successResponse) => {
                resolve(successResponse);
            });     
        });
    });
}

// Executes my_func within host website
// my_func should return primitive value
// my_func cannot have any parameters
async function execute_Function(my_func,args){

    let retData= (await execute_Function_Promise(my_func,args))[0]['result'];
    return retData;
}
function execute_Function_Promise(my_func, args) {
    return new Promise((resolve, reject) => {
        getActiveTab((tab)=>{
            chrome.scripting.executeScript(
                {
                    target : {tabId: tab.id},
                    func: my_func,
                    args : args
                },
                (successResponse) => {
                resolve(successResponse);
            });     
        });
    });
}