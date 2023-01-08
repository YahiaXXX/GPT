import bot from "./assets/bot.svg"
import user from "./assets/user.svg"


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';
  loadInterval = setInterval(
    ()=>{
      element.textContent+='.'
      if (element.textContent ==='....') element.textContent='';
    
    },300)
}

function typeText(element,text){
  let index=0;
  let interval = setInterval(()=>{
    if(index<text.length){
      element.innerHTML+=text.charAt(index);
      index++;}
      else{
        clearInterval(interval)
      }
  },20)

}

function generateUniId(){
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexa = randomNum.toString(16);

  return `id-${timeStamp}-${hexa}`
}


function chatStripe(isAi,value,uniqueId){
  return (`
  <div class=" wrapper ${isAi && 'ai' }" >
    <div class = "chat" >
    <div class = "profile" >
      <img src="${isAi  ? bot  : user }" alt="${isAi  ? "bot"  : "user" }" />
    </div>
    <div class = "message" id=${uniqueId}>
      ${value}
    </div>
    </div>
  </div>

  `)

}

const handleSubmit = async (e)=>{
  e.preventDefault();

  const data= new FormData(form);

   //user
   chatContainer.innerHTML+= chatStripe(false,data.get('prompt'));
   form.reset()
   //bot
    const uniqueId = generateUniId();
   chatContainer.innerHTML+= chatStripe(true," ",uniqueId);
   chatContainer.scrollTop = chatContainer.scrollHeight; //put the message in view
      
   const messageDiv = document.getElementById(uniqueId);
   loader(messageDiv);

   const res = await fetch('http://localhost:5000',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      prompt: data.get('prompt')
    })
   })

   clearInterval(loadInterval);
   messageDiv.innerHTML='';
   if(res.ok){
    const data = await res.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv,parsedData);
  }else{
    const error = await res.text();
    messageDiv.innerHTML='there is a problem...'

    alert(error);


  }

}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup', (e)=> {
  if(e.keyCode===13) handleSubmit(e);
})