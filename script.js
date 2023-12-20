let total = 0, tax = .2, items = [], ptotal = document.getElementsByTagName("p").length,
  objectArr = [], currentSec = 1, userInput = "",text = "";
/* Page Functions*/
function changePage(dir) {
  var boxWidth = document.body.width;
  currentSec += (dir == "next") ? 1 : (dir == "back") ? -1 : 0;
  currentSec = (currentSec > 3) ? 3 : (currentSec < 1) ? 1 : currentSec;
  setPage();
  //if (currentSec == 1) { $("#page1").animate({ width: boxWidth }) } else if (currentSec == 2) { $("#page2").animate({ width: boxWidth }) } else if (currentSec == 3) { $("#page3").animate({ width: boxWidth }) }
  console.log(currentSec);
}
let setPage = () => {
  if (currentSec == 1) {
    $("#page2").hide();
    $("#page3").hide();
    $("#page1").show();
    $(".left").fadeOut("slow").hide();
  } else if (currentSec == 2) {
    $("#page1").hide();
    $("#page3").hide();
    $("#page2").show();
    $(".right").fadeIn("slow").show();
    $(".left").fadeIn("slow").show();
  } else if (currentSec == 3) {
    $("#page1").hide();
    $("#page2").hide();
    $("#page3").show();
    $(".right").fadeOut("slow").hide();
  }
}
/* Price Functions */

let moneyFormat = (money) => {
  money = money.replace("$", "");
  for (var ind = 0; ind != money.length; ind++) {
    if (money.charAt(ind) == ",") { money = money.replace(money.charAt(ind), ""); }
  }
  return parseFloat(money);
}
let moneyConvert = (num) => {
  var sNum = String(parseInt(num)), commaIndex = 0, modifer = 0, cents = num - parseInt(num);
  for (var i = sNum.length; i > 3; i -= 3) {
    commaIndex = sNum.length - (3 * (1 + modifer) + modifer);
    sNum = sNum.slice(0, commaIndex) + "," + sNum.slice(commaIndex);
    console.log(`${i} ${commaIndex} ${sNum}`);
    modifer++;
  }
  return "$" + sNum + String(cents).replace("0", "");
}
function updatePrice(prodname) {
  var prodNum = prodname.replace("it", ""),
    prodprice = "pr" + prodNum,
    name = "pn" + prodNum,
    price = document.getElementById(prodprice).textContent;
  name = document.getElementById(name).textContent;
  prodprice = document.getElementById(prodprice).textContent;
  addItem(name, price);
  total += moneyFormat(price);
  updateLab();
}
function updateLab() {
  var items = document.getElementById("total").childNodes.length, tempTotal = 0;
  console.log("there are this many item => " + items);
  for (var many = 0; many != items; many++) {
    console.log(`The ${many}th child ` + moneyFormat(document.getElementById("total").childNodes[many].childNodes[2].textContent));
    tempTotal += moneyFormat(document.getElementById("total").childNodes[many].childNodes[2].textContent);
  }
  console.log("The toal with tax is " + Math.round(tempTotal * .2 + tempTotal));
  $("#price").text(moneyConvert(Math.round(tempTotal * .2 + tempTotal)));
}
/* Item Functions*/
function addItem(name, price) {
  var item = document.createElement("li"),
    xprice = document.createElement("label"),
    xbutton = document.createElement("button"),
    xdiv = document.createElement("div"),
    icon = document.createElement("i");
  item.textContent = name;
  xprice.textContent = price;
  xbutton.className = "delete";
  icon.className = "material-icons";
  icon.textContent = "close";
  xbutton.setAttribute("onclick", "deleteItem(this);");
  xdiv.className = "deldiv";
  $(xbutton).append(icon);
  $(xdiv).append(item);
  $(xdiv).append("&nbsp;");
  $(xdiv).append(xprice);
  $(xdiv).append(xbutton);
  $("#total").append(xdiv);
  receipt();
}
function deleteItem(tagname) {
  var divfind = tagname.parentNode;
  divfind = divfind.innerHTML;
  console.log(divfind);
  divfind = divfind.substring(divfind.indexOf("<label>") + 7, divfind.indexOf("</label>") - 1);
  console.log(total + " - " + moneyFormat(divfind));
  total -= moneyFormat(divfind);
  $(tagname).parent().remove();
  updateLab();
}

/* Filtering Functions*/
var createProd = (name = "", keys = [""], page) => prod = {
  itemName: name,
  itemKeyWords: keys,
  itemPage: page,
  Find: function (potName) {
    var totalKeys = false;
    for (var product of this.itemKeyWords) {
      if (product == undefined) { continue; }
      product = product.toLowerCase();
      if (potName.toLowerCase() == product || product.includes(potName) || this.itemName.toLowerCase().includes(potName.toLowerCase())) { totalKeys = true; break; }
      else if (this.itemKeyWords.indexOf(product) == this.itemKeyWords.length - 1) { totalKeys = false; }
    }
    return totalKeys;
  },
  GiveAll: function () {
    let totalVal = "";
    for (var val of this.itemKeyWords) {
      totalVal += (val != undefined) ? " " + val : "";
    }
    return totalVal;
  },
  ReturnEve: function (name) {
    if (this.Find(name)) {
      return this.itemName;
    } else {
      return "";
    }
  }
};
function setup() {
  $("#divTotal").hide();
  for (var i = 1; i <= ptotal; i++) {
    items[i] = document.getElementById("pn" + i).textContent;
  }
}
const inputElm = document.getElementById("sr");
const inputHandler = function(e) {
}
$("#sr").on('change keydown paste input', function(){
    userInput = inputElm.value;
    see();
});
function see() {
  keySet();
  for(var amount = 27; amount != 0;amount--){
    if(document.getElementById("li" + amount) == null){continue;}
    $(`#li${amount}`).fadeOut("slow").remove().delay(1000);
  }
  for (var int = 1; int <= objectArr.length - 1; int++) {
    if (objectArr[int].Find(userInput)) {
      createLi(objectArr[int].ReturnEve(userInput) + " (" + objectArr[int].itemPage +")",int);
    }
  }
  if (document.getElementById("avaul").childElementCount == 0) {$("#avaul").empty(); $("#avaul").append("CANNOT FIND ITEM");}
  if(userInput == ""){$("#avaul").empty(); $("#avaul").append("Type something in the search bar!");}
  keyShowEve();
}
function createLi(text,num) {
  let newLi = document.createElement("li"), searchContent =  document.getElementById("avaul");
  newLi.textContent = text;
  newLi.id = "li" + num;
  $("#avaul").prepend(newLi).fadeIn("slow");
}
function keySet(prod) {
  var keyArr = [], amtKey = 0, keypage;
  for (var i = 1; i <= ptotal; i++) {
    if (document.body.contains(document.getElementsByClassName(i)[1]) == true) {
      keyArr = [];
      keypage = document.getElementsByClassName(i)[1].parentNode.parentNode.parentNode.id;
      keypage = keypage.charAt(0).toUpperCase() + keypage.substring(1,4) + " " + keypage.substring(4,5);
      amtKey = document.getElementsByClassName(i).length;
      for (var j = 1; j <= amtKey; j++) {
        keyArr[j] = document.getElementsByClassName(i)[j - 1].textContent;
      }
      objectArr[i] = createProd(items[i], keyArr,keypage);
    }
  }
}
/* Animations Function*/
function keyEve() {
  $("#avaul").slideUp("slow").fadeOut("slow");
}
function showForm() { $("#form").slideToggle("slow");}
function hideForm() {
  $("#form").fadeOut("slow").hide(0);
}
function keyShowEve() {
  if (document.getElementById("avaul").childNodes.length > 0) {
    $("#availablity").slideDown("slow").fadeIn(1000);
    $("#avaul").slideDown("slow");
  }
}
function expless() {
  $("#availablity").slideUp("slow").fadeOut("slow");
}
$(document).ready(function () {
  function hovOn() {
    $("#divTotal").attr("open", "");
    $("#diaTotal").slideDown("slow");
  }
  setPage();
  function hovOff() {
    $("#diaTotal").slideUp("slow");
    $("#divTotal").hide();
  }
  updateLab();
  $(".bag").hover().click(function () { hovOn() });
  $("#close").click(function () { hovOff() });
  $(".diaTotal").hover(function () { hovOn() }, function () { hovOff() });
  $("#scbutton").click(function () { if (document.getElementById("avaul").childNodes.length > 0) { $("#availablity").slideDown("slow").fadeIn(1000) } });
});
/*Email function*/
function receipt(){
  var total = document.getElementById("total"), totalItems = [""],maxStrLen = 0, maxInd = 0,spaceAdd = "";
  text = "Your Order was:";
  for(var x = 0; x != total.childNodes.length;x++){
    totalItems[x] = total.childNodes[x].textContent.replace("close","");
    totalItems[x] = totalItems[x].substring(0,totalItems[x].indexOf("$")) + "| " + totalItems[x].substring(totalItems[x].indexOf("$"),totalItems[x].length-1);
    if(totalItems[x].length > maxStrLen){
      maxStrLen = totalItems[x].length;
      maxInd = x;
    }
  }
  console.log("Max length => " + maxStrLen + "\nMax String length => " + totalItems[maxInd].substring(0, totalItems[maxInd].indexOf("$")).length);
  totalItems.forEach(element => text += "<br>&nbsp;&nbsp;" + element);

}
function sendEmail() {
  var uemail = document.getElementById("eint").value,
    total = document.getElementById("price").textContent,
    totalAmount = document.getElementById("total").childNodes.length, 
    date = new Date();
  Email.send({
    SecureToken: "",
    To: uemail,
    From: "",
    Subject: "Shoe Stores",
    Body:   `${text}<br>Your total for ${totalAmount} items was ${total}!<br>Ordered on ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}!<br>Thank you for shoping!`,
  }).then(function (message) {
    alert(message)
  });
}
