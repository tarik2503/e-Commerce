$(function(){var totalAmount=0;
var count = 0;
var home = ""
var cart = ""
var totalPrice = 0;
let cartData = [];
let data = [];
var settingData = (data) => {
    let string = JSON.stringify(data);
    localStorage.setItem("user", string);
  };

let check = JSON.parse(localStorage.getItem("user"));
if (check == "" || localStorage.getItem("user") === null) {
  fetch("Data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      settingData(data);
    //   data = JSON.parse(window.localStorage.getItem("user"));
    //   location.reload();
    });
}



const add = () => {
   data.forEach(function(item , index){
// count1=count2;
     home = "yes"
    let text = "";
    text = `
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-center bg-light" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top   img-fluid mx-auto p-1 " style="height:250px; width:300px; object-fit:cover"  alt="image">
            <div class="card-body">
              <h5 class="card-title">${item.productName}</h5>
              <p class="card-text">${item.price} </p>
              <button type="button" class="btn btn-primary buy" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-whatever="@fat">buy now</button>
              
            </div>
        </div>
    </div>`;
    count = (index+1)


    $("#container_fill").append(text);
    count = index +1;

   })
    
  };
 
  $( "#home" ).on( "click", function() {
    $("#home-div").attr("style", "display:block !important");
     $("#cart-div").attr("style", "display:none !important");
     if(home ==""){
        data = JSON.parse(window.localStorage.getItem("user"));
    add(); 
     }
    

} );
data = JSON.parse(window.localStorage.getItem("user"));
add()

 $("#cart-div #total-amount").text(totalAmount? totalAmount:0);
 function TableFormat(){
     cartData= JSON.parse(window.localStorage.getItem("cart"));
    cart = "yes"
    let text = "";
    cartData.forEach(function(item, index){   
        text += `<tr>
    <td style="visibility:hidden;">${item.id}</td>
    <td ><img src="${item.url}" alt="image" class="img-fluid p-2" style="height:70px; width:70px; object-fit:cover"></td>
    <td>${item.name}</td>
    <td>${item.nuOfItem}</td>
    <td >${item.price}</td>
    <td ><button type="button" id="deleteItem" class="btn btn-delete btn-outline-dark"><ion-icon name="trash-outline" class="icon" ></ion-icon></button></td>
    </tr>`;

    $("#table-div tbody").html(text);
})

}


$( "#cart" ).on( "click", function() {
    $("#home-div").attr("style", "display:none !important");
    $("#cart-div").attr("style", "display:block !important");
    // if(cart ==""){
        TableFormat();
        // }
    }
    
 );

$("#addItem").submit(function(){
    
    const product_name = document.querySelector("#floatingInput1").value;
    const url = document.querySelector("#floatingInput2").value;
    const price = document.querySelector("#floatingInput3").value;
    
    const obj = {
        productName: product_name,
        image: url,
        price: price,
    };
    let newData = data;
    newData.push(obj);
    settingData(newData);
    $("#container_fill").append(`
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-center bg-light" style="width: 18rem;">
        <img src="${url}" class="card-img-top   img-fluid mx-auto p-1 " style="height:250px; width:300px; object-fit:cover"  alt="image">
        <div class="card-body">
        <h5 class="card-title">${product_name}</h5>
        <p class="card-text">${price} </p>
        <button type="button" class="btn btn-primary buy" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-whatever="@fat">buy now</button>
        
        </div>
        </div>
        </div>`);
    });
    
  //buy now modal function
  var productName;
  var productPrice;
  $("#container_fill").on("click", ".buy", function(){

      const contentH5 = $(this).closest(".card-body").find("h5").text();
      const contentP = $(this).closest(".card-body").find("p").text();
      const contentImg = $(this).closest(".card").find("img").attr("src");
      // const noOfItem = $("#noOfItem").val();
      
      $(".detailsOfItem h3").first().text(`${contentH5}`)
      $("#showPrice").text(`₹${contentP}`)
      productName=contentH5;
      productPrice=contentP;
      
      const modalImage = document.querySelector("#modal_image");
      modalImage.setAttribute("src", contentImg);
      
      
    });
    var settingCartData = (data) => {
        let string = JSON.stringify(data);
        localStorage.setItem("cart", string);
    };
    
    let cid=0;
    
    //  cartData=JSON.parse(window.localStorage.getItem("cart"));
    $("#modal_save").on("click", function(){
        cid = cid + 1;
        const noOfItem = $("#noOfItem").val();
        const imgSrc = document.getElementById("modal_image").getAttribute("src");
        let cartObj = {
            id: cid,
            url: imgSrc,
            name: productName,
            nuOfItem : noOfItem,
            price: productPrice,
        };
        totalAmount = totalAmount + (+productPrice*(+noOfItem));
        
        $("#cart-div #total-amount").text(totalAmount);
        
        if(!localStorage.getItem("cart")){
            
            let string = JSON.stringify([cartObj]);
            localStorage.setItem("cart", string);
        }
    else{
        cartData=JSON.parse(window.localStorage.getItem("cart"));
        let newCartData  = cartData
        newCartData.push(cartObj)
        settingCartData(newCartData)
    }  
    
})

  $("#table-div").on("click",".btn-delete", function(){
    
      
      var removeRow = $(this).parents("tr");
      var rem = $(this).closest("tr");
      var col1=rem.find("td:eq(0)").text().trim();
      
      
      removeRow.remove();
      //deleting the item
      let items = JSON.parse(localStorage.getItem("cart"));
      let price = items.filter((element)=>element.id == +col1);
      console.log(price);
      totalAmount = +totalAmount - (Number(price[0].price*Number(price[0].nuOfItem)));


      $("#cart-div #total-amount").text(totalAmount);




      let result = JSON.stringify(items.filter((element)=>element.id !== +col1));
      localStorage.setItem("cart", result);
      
      // items.splice(id - 1, 1);
      // settingData(items);
      // // setting id when item gets deleted
      // const temp = JSON.parse(localStorage.getItem("cart"));
      // for (let i = 1; i <= temp.length; i++) {
          //   let temp1 = temp[i - 1];
          //   temp1.id = i;
          // }
          // settingData(temp);
          
  })
})


  
 
