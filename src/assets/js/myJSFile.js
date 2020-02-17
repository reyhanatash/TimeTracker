// function detecFunction(e){
//   // if(e.parentElement.nextElementSibling.firstChild.id === "select2-contact"){
//   //   // $("#searchCompany").text(e.value);
//   //   // if(e.value){
//   //   //   $("#saveCompany").css("display","");
//   //   // }else{
//   //   //   $("#saveCompany").css("display","none");
//   //   // }
//   //   setTimeout(()=>{
//   //     $(".select2-results__message").html('No result found. Add new contact below');
//   //   },0)
//   // }
//
//
//
// }
function checkEmail(email){
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
