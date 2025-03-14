import "./App.css";
import React, { useEffect, useState,useRef } from "react";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg"
import {BsFillSendFill} from "react-icons/bs"
import kyo from "./assets/kyowhite.svg"

function App() {
  const [data, setData] = useState([]);
  const [historique,setHistorique]=useState([])
  const [email, setEmail] = useState("");
  const [mymsg,setMymsg]=useState([])
  const [inp,setInp]=useState("")
  const [first,setFirst]=useState("")
  const firstRender = useRef(true);
  
  // const form = document.querySelector("form");
  // const chatContainer = document.querySelector("#chat_container");
  let loadInterval;

  function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
      element.textContent += ".";
      if (element.textContent === "....") element.textContent = "";
    }, 300);
  }
  
  function addButton(mydiv){
    const myButton = document.createElement('button');
      myButton.innerText = 'send';
      
      myButton.addEventListener('click', function() {
        console.log('hello');
      });
      mydiv.appendChild(myButton)


  }

  function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }
  function generateUniId() {
    const timeStamp = Date.now();
    const randomNum = Math.random();
    const hexa = randomNum.toString(16);
  
    return `id-${timeStamp}-${hexa}`;
  }
  function chatStripe(isAi, value, uniqueId) {
    if(isAi) return `
    <div class=" wrapper ai" >
      <div class = "chat" >
      <div class = "profile" >
        <img src="${bot}" alt="bot" />
      </div>
      <div class = "messageAi" id=${uniqueId} >
        ${value}
      </div>
      
      </div>
    </div>
  
    `
    else{
      return `
    <div class=" wrapper user" >
      <div class = "chat" >
      
      <div class = "messageUser" id=${uniqueId}>
        ${value}
      </div>
      <div class = "profile" >
        <img src="${user}" alt="user" />
      </div>
      </div>
    </div>
  
    `
    }
   
  }

  const handleSubmit2 = async (result) => {
    

    const uniqueId = generateUniId();
    document.getElementById("chat_container").innerHTML += chatStripe(true, " ", uniqueId);
    document.getElementById("chat_container").scrollTop = document.getElementById("chat_container").scrollHeight; //put the message in view
  
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
    const res = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: result[0],
      }),
    });
  
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
    if (res.ok) {
      const data = await res.json();
      const parsedData = data.bot.trim();
      setHistorique([...historique,parsedData])
      typeText(messageDiv, parsedData)
      messageDiv.innerHTML += '<button class="send-btn">Send</button>';
      messageDiv.addEventListener('click', (event) => {
        if (event.target && event.target.matches('.send-btn')) {
          handleComposeClick(parsedData,result[1])
        }
      });
    } else {
      const error = await res.text();
      messageDiv.innerHTML = "there is a problem...";
  
      alert(error);
    }
  };
  let a=0

  const handleSubmit = async (e) => {
    
    const form = document.querySelector("form");
    const chatContainer = document.querySelector("#chat_container");
    e.preventDefault();
  
    const data = new FormData(form);
  
    //user
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
    form.reset();
    //bot
    const uniqueId = generateUniId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight; //put the message in view
  
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);
  
    const res = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `this is my email ${historique[historique.length-1]} : ${data.get("prompt")} ` ,
      }),
    });
  
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
    if (res.ok) {
      const data = await res.json();
      const parsedData = data.bot.trim();
      setHistorique([...historique,parsedData])
      typeText(messageDiv, parsedData);

      // const myButton = document.createElement('button');
      // myButton.innerText = 'send';
      
      // myButton.addEventListener('click', function() {
      //   console.log("here button")
      // });
      messageDiv.innerHTML += '<button class="send-btn">Send</button>';
      messageDiv.addEventListener('click', (event) => {
        if (event.target && event.target.matches('.send-btn')) {
          handleComposeClick(parsedData,email)
        }
      });
     
      
    } else {
      const error = await res.text();
      messageDiv.innerHTML = "there is a problem...";
  
      alert(error);
    }
  };

  const btnFunction = async () => {
    // let res = await test();
    // setEmail(res[1])
    // sendToGpt("please , reply to this email for me: " + res[0]);
  };

  // const test= async ()=>{
  //   /* eslint-disable no-undef */
  //   chrome.tabs.query({active: true, currentWindow:true}, tabs=>{
  //     const activeTabId = tabs[0].id;
  //     chrome.scripting.executeScript(
  //       {
  //         target: {tabId: activeTabId},
  //         function: ()=> {return document.getElementById(":ms").innerHTML}
  //         // function: ()=> {return "hello how are you?"}
  //       }
  //     )
  //   })
  // }
  const regenerate = () => {
    sendToGpt(`this is the paragraphe : ${data[data.length-1]} ,${inp} `)
    setMymsg([...mymsg,inp])
    setInp("")
    // sendToGpt(`please reformulate this phrase :${data[data.length-1]}`);
    // console.log(data[data.length-1])
  };
  const test = async () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTabId },
            // function: () => document.getElementById(":mg").innerHTML,
            // function: () =>{
              
            
            // },
            function: () =>{
              let senderElement = document.querySelector('.gD')
              const senderEmail = senderElement.getAttribute('email');
              let result = document.getElementsByClassName("a3s aiL ")[0];
              if (result.children.length > 0) {
                for (let i = 0; i < result.children.length; i++) {
                  const child = result.children[i];
                  if (child.getAttribute("dir") === "ltr") {
                    
                   return [child.innerHTML,senderEmail]
                    break;
                  }
                }
              } else {
              //   let content = "";
              // for (let i = 0; i < result.length; i++) {
              //   content += result[i].innerHTML;
                return [result.innerHTML,senderEmail]
                 }
               
                }
          },
          (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            } else {
              resolve(result[0].result);
            }
          }
        );
      });
    });
  };

  
  // const getContent = async () => {
  //   const res = await fetch("http://localhost:5000/content");
  //   const data = await res.json();
  //   const content = data.content;
  //   console.log(content);
  //   return "hello chatbot";
  // };

  const sendToGpt = async (msg) => {
    const res = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: msg,
      }),
    });
    let res2 = await res.json();
    setData([...data,res2.bot]);
  };
  const handleComposeClick = (emailbody,sender) => {
    const senderEmail = sender;
    const emailBody = emailbody;
    const baseUrl = "https://mail.google.com/mail/u/0/";
    const queryParams = `view=cm&fs=1&tf=1&to=${senderEmail}&body=${encodeURIComponent(
      emailBody
    )}`;
    const url = `${baseUrl}?${queryParams}`;

    // chrome.tabs.update({ url });
    chrome.windows.create({
      url,
      type: "popup",
      width: 500,
      height: 500,
      top: window.screen.height - 500,
      left: window.screen.width - 500,
    });
  };
 
  const getEmail= async ()=>{
    const text= await test()
    setEmail(text[1])
    setFirst(text[0])
     return text

  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

  
  getEmail().then(res=>{handleSubmit2(res);
    
    })
     
    
    
  },[]);
  return (
    // <div className="App">
    //   {/* <div className=" logoDiv"> <p >KYO</p> </div> */}
    //   <div className="reponses" >
    //   {data?.map((item,index)=>(
    //     <>
    //      <div  className="reponse-item" >
    //     <p className=" flex-1" >{item}</p> 
    //     <button className="flex-1" onClick={()=>handleComposeClick(index)}>Send it </button>
    //    </div>
    //    <div>
    //     {mymsg[index]}

    //    </div>
        
    //     </>
      
    //   ))}
    //   </div>
      
    //   <button className="regenerate" onClick={regenerate}>Regenerate</button>
    //   <div>
    //     <input value={inp} placeholder="talk to me here" onChange={(e)=>setInp(e.target.value)} />
    //   </div>
      
    // </div>
    <div id="app" className="App">

      <div className="header" >
        <div className="img-div" > <img src={kyo} alt="logo" /> </div>
        <h1> KYO </h1>
      </div>
      <div id="chat_container" >
      </div>
      <form className="fr" onSubmit={handleSubmit} >
      <textarea className="inp" name="prompt" id="" cols="1" rows="1" placeholder="What i do for you?" ></textarea>
      <button type="submit" > <BsFillSendFill/> </button>
      </form>
    </div>
  );
}

export default App;
