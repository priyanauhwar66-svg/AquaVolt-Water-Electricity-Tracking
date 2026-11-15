const API_BASE_URL = "http://localhost:5000/api";
const TOKEN_KEY = "aquavolt_token";
const USER_KEY = "aquavolt_current_user";

function getToken(){ return localStorage.getItem(TOKEN_KEY); }
function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
  catch { return null; }
}
function authHeaders(){
  return { "Content-Type":"application/json", "Authorization":`Bearer ${getToken()}` };
}
async function apiRequest(path, options={}){
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), ...(getToken() ? {Authorization:`Bearer ${getToken()}`} : {}) }
  });
  const data = await response.json().catch(()=>({message:"Unexpected server response"}));
  if(!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}
function requireLogin(){
  if(!getToken() || !getCurrentUser()){
    location.href="login.html";
    return false;
  }
  return true;
}
function showMessage(element, message, error=false){
  if(element){ element.textContent=message; element.style.color=error?"#c0392b":"#16834a"; }
}
function logout(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  location.href="login.html";
}
document.addEventListener("DOMContentLoaded",()=>{
  const reg=document.getElementById("registerForm");
  if(reg) reg.addEventListener("submit",async e=>{
    e.preventDefault();
    const message=document.getElementById("message");
    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;
    try{
      const r=await fetch(`${API_BASE_URL}/auth/register`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,password})
      });
      const d=await r.json();
      if(!r.ok) throw new Error(d.message || "Registration failed");
      showMessage(message,"Registration successful. Please log in.");
      reg.reset();
      setTimeout(()=>location.href="login.html",900);
    }catch(err){showMessage(message,err.message,true);}
  });
  const login=document.getElementById("loginForm");
  if(login) login.addEventListener("submit",async e=>{
    e.preventDefault();
    const message=document.getElementById("message");
    try{
      const d=await apiRequest("/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email:document.getElementById("email").value.trim(),
          password:document.getElementById("password").value
        })
      });
      localStorage.setItem(TOKEN_KEY,d.token);
      localStorage.setItem(USER_KEY,JSON.stringify(d.user));
      location.href="dashboard.html";
    }catch(err){showMessage(message,err.message,true);}
  });
  const logoutBtn=document.getElementById("logoutBtn");
  if(logoutBtn) logoutBtn.addEventListener("click",e=>{e.preventDefault();logout();});
});
