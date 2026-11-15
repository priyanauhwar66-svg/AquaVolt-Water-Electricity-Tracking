document.addEventListener("DOMContentLoaded",()=>{
 if(!requireLogin())return;
 const u=getCurrentUser();
 const h=document.querySelector(".profile-card h2"), p=document.querySelector(".profile-card p");
 if(h)h.textContent=u?.name||"User";
 if(p)p.textContent=u?.email||"";
 const details=document.querySelector(".details");
 if(details)details.innerHTML=`<p>Email: ${u?.email||"—"}</p><p>Account: AquaVolt Water Tracker</p>`;
});
