const fs = require('fs')
const css = fs.readFileSync('src/App.css', 'utf8')

const loginCSS = `

/* ══════════════════════════════════════════
   LOGIN PORTAL
══════════════════════════════════════════ */
.login-portal{
  position:fixed;inset:0;z-index:999;
  display:flex;align-items:center;justify-content:center;
  overflow-y:auto;padding:0;
  background:radial-gradient(ellipse 80% 60% at 15% 15%,rgba(0,212,184,0.13) 0%,transparent 55%),
    radial-gradient(ellipse 60% 70% at 85% 5%,rgba(124,77,255,0.11) 0%,transparent 50%),
    radial-gradient(ellipse 50% 50% at 50% 100%,rgba(244,114,182,0.07) 0%,transparent 50%),
    linear-gradient(160deg,#02040b 0%,#04070f 50%,#030610 100%);
}
:root.light .login-portal{
  background:radial-gradient(ellipse 80% 60% at 15% 15%,rgba(0,153,168,0.1) 0%,transparent 55%),
    radial-gradient(ellipse 60% 70% at 85% 5%,rgba(102,51,255,0.07) 0%,transparent 50%),
    linear-gradient(160deg,#e8edf8 0%,#f0f4ff 100%);
}
.login-aura{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(0,212,184,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,212,184,0.03) 1px,transparent 1px);
  background-size:44px 44px;
  animation:grid-drift 30s linear infinite;
}
.login-shell{
  position:relative;z-index:1;
  display:grid;
  grid-template-columns:minmax(320px,1fr) minmax(400px,460px);
  width:min(1080px,100%);
  min-height:100vh;
  border:none;
  background:transparent;
  animation:shell-in .5s cubic-bezier(.23,1,.32,1);
}
@keyframes shell-in{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
.login-showcase{
  position:relative;
  display:flex;flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:48px 40px;
  color:#fff;
  overflow:hidden;
  background:linear-gradient(145deg,
    rgba(0,212,184,0.09) 0%,
    rgba(0,212,184,0.04) 40%,
    rgba(124,77,255,0.07) 80%,
    transparent 100%);
  border-right:1px solid rgba(0,212,184,0.08);
  text-align:center;
}
.login-showcase::before{
  content:'';position:absolute;
  left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--accent),transparent);
  animation:scan-line 5s ease-in-out infinite;
  opacity:0.3;
}
@keyframes scan-line{
  0%{top:0%;opacity:0}
  10%{opacity:0.3}
  90%{opacity:0.3}
  100%{top:100%;opacity:0}
}
.login-showcase::after{
  content:'';position:absolute;inset:0;
  background-image:linear-gradient(rgba(0,212,184,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,212,184,0.03) 1px,transparent 1px);
  background-size:28px 28px;pointer-events:none;
}
.login-showcase-top{
  position:relative;z-index:1;
  display:flex;flex-direction:column;
  align-items:center;gap:16px;
  margin-bottom:32px;
  animation:fade-up .6s ease both;
}
.login-mark{
  width:180px;height:180px;
  object-fit:contain;
  border-radius:24px;
  filter:drop-shadow(0 0 40px rgba(0,212,184,0.3));
  animation:logo-float 4s ease-in-out infinite alternate;
}
@keyframes logo-float{
  from{transform:translateY(0)}
  to{transform:translateY(-12px)}
}
.login-mark-fb{
  width:100px;height:100px;border-radius:24px;
  background:linear-gradient(135deg,var(--accent),var(--violet,#7c4dff));
  display:flex;align-items:center;justify-content:center;
  font-size:42px;font-weight:800;color:#fff;
  font-family:'Syne',sans-serif;
  box-shadow:0 0 40px rgba(0,212,184,0.3);
}
.login-brand{
  font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
  background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.75));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;letter-spacing:-.5px;
}
:root.light .login-brand{
  background:linear-gradient(135deg,#0a1628,#1e3a5f);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.login-brand em{
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;font-style:normal;
}
.login-brand-sub{
  font-size:11px;color:rgba(226,232,240,0.5);
  letter-spacing:2.5px;text-transform:uppercase;margin-top:2px;
}
:root.light .login-brand-sub{color:var(--text3)}
.login-copy{
  position:relative;z-index:1;
  max-width:420px;
  animation:fade-up .6s ease .1s both;
}
.login-kicker{
  display:inline-block;
  border:1px solid rgba(0,212,184,0.2);border-radius:999px;
  padding:6px 16px;
  background:rgba(0,212,184,0.08);
  font-size:11px;font-weight:600;color:var(--accent);
  margin-bottom:18px;letter-spacing:.3px;
  box-shadow:0 0 20px rgba(0,212,184,0.08);
}
.login-copy h1{
  font-family:'Syne',sans-serif;
  font-size:36px;line-height:1.08;font-weight:800;
  letter-spacing:-.8px;
  background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.65));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;margin-bottom:14px;
}
:root.light .login-copy h1{
  background:linear-gradient(135deg,#0a1628,#2d4a7a);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.login-copy p{
  font-size:13.5px;line-height:1.75;
  color:rgba(226,232,240,0.55);
}
:root.light .login-copy p{color:var(--text2)}
.login-metrics{
  position:relative;z-index:1;
  display:grid;grid-template-columns:repeat(3,1fr);gap:10px;
  margin-top:32px;width:100%;max-width:380px;
  animation:fade-up .6s ease .2s both;
}
.login-metrics div{
  border:1px solid rgba(0,212,184,0.12);border-radius:14px;
  padding:14px 10px;
  background:rgba(0,212,184,0.05);
  backdrop-filter:blur(10px);
  text-align:center;transition:all .2s;
}
.login-metrics div:hover{
  border-color:rgba(0,212,184,0.25);
  background:rgba(0,212,184,0.1);
}
.login-metrics strong{
  display:block;font-family:'Syne',sans-serif;
  font-size:22px;font-weight:700;
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
:root.light .login-metrics strong{
  background:linear-gradient(135deg,#0099a8,#6633ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.login-metrics span{
  display:block;margin-top:3px;
  font-size:9px;text-transform:uppercase;
  letter-spacing:1.2px;color:rgba(226,232,240,0.45);
}
:root.light .login-metrics span{color:var(--text3)}

/* LOGIN BOX */
.login-box{
  position:relative;z-index:1;
  background:rgba(4,7,13,0.92);
  backdrop-filter:blur(32px) saturate(150%);
  padding:44px 40px;
  display:flex;flex-direction:column;
  justify-content:center;
  overflow-y:auto;
  max-height:100vh;
  animation:fade-up .6s ease .15s both;
}
:root.light .login-box{
  background:rgba(255,255,255,0.95);
  border-left:1px solid rgba(0,153,168,0.1);
}
.login-logo{margin-bottom:28px}
.login-card-eyebrow{
  font-size:10px;font-weight:700;
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;
}
.login-card-title{
  font-family:'Syne',sans-serif;font-size:28px;line-height:1.1;
  font-weight:800;color:var(--text);letter-spacing:-.5px;margin:0;
}
:root.light .login-card-title{color:#0a1628}
.login-card-sub{font-size:13px;color:var(--text2);line-height:1.6;margin-top:10px}
.login-methods{
  display:grid;grid-template-columns:1fr 1fr;gap:8px;
  margin-bottom:16px;padding:4px;
  border:1px solid rgba(0,212,184,0.1);border-radius:13px;
  background:rgba(255,255,255,0.03);
}
:root.light .login-methods{background:var(--surface)}
.login-method{
  border:0;border-radius:10px;background:transparent;
  color:var(--text2);padding:10px;font-size:12.5px;font-weight:600;
  font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;
}
.login-method.active{
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  color:#fff;box-shadow:0 4px 20px rgba(0,212,184,0.3);
}
.login-field{display:block;margin-bottom:16px}
.login-field span{
  display:block;font-size:10px;color:var(--text3);
  margin-bottom:5px;font-weight:700;
  text-transform:uppercase;letter-spacing:1px;
}
.login-field input{
  width:100%;height:44px;
  border:1px solid var(--border2);border-radius:11px;
  background:rgba(255,255,255,0.04);color:var(--text);
  padding:0 13px;font-family:'DM Sans',sans-serif;
  font-size:13px;outline:none;transition:all .2s;
}
:root.light .login-field input{background:var(--surface)}
.login-field input:focus{
  border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(0,212,184,0.08);
}
.login-title{
  font-family:'Syne',sans-serif;font-size:15px;font-weight:700;
  margin-bottom:14px;color:var(--text);
}
.login-desc{font-size:12.5px;color:var(--text2);margin-bottom:16px;line-height:1.6}
.login-back{
  background:none;border:none;color:var(--text3);font-size:12px;
  cursor:pointer;font-family:'DM Sans',sans-serif;
  margin-bottom:16px;display:flex;align-items:center;gap:5px;
  transition:color .14s;padding:0;
}
.login-back:hover{color:var(--accent)}
.login-back svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5}
.login-error{
  background:rgba(239,68,68,0.08);
  border:1px solid rgba(239,68,68,0.2);
  border-radius:10px;color:var(--red);
  padding:10px 12px;font-size:12px;
  text-align:center;margin-bottom:12px;
  animation:shake .3s ease;
}
@keyframes shake{
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-6px)}
  75%{transform:translateX(6px)}
}
.login-user-preview{
  display:flex;align-items:center;gap:12px;
  background:linear-gradient(135deg,rgba(0,212,184,0.08),rgba(124,77,255,0.05));
  border:1px solid rgba(0,212,184,0.2);border-radius:13px;
  padding:13px;margin-bottom:20px;
}
.lup-av{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:17px;color:#fff;flex-shrink:0;
  font-family:'Syne',sans-serif;
}
.lup-name{font-weight:700;font-size:14px;color:var(--text)}
.lup-role{font-size:11px;color:var(--text3)}
.user-sel-grid{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:8px;margin-bottom:16px;
}
.usc{
  background:rgba(255,255,255,0.04);
  border:1px solid var(--border);border-radius:13px;
  padding:12px 10px;cursor:pointer;transition:all .2s;
  display:grid;grid-template-columns:32px 1fr;
  grid-template-rows:auto auto;column-gap:9px;
  align-items:center;font-family:'DM Sans',sans-serif;
  text-align:left;min-height:72px;
  position:relative;overflow:hidden;
  backdrop-filter:blur(8px);
}
:root.light .usc{background:var(--surface)}
.usc::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(0,212,184,0.08),rgba(124,77,255,0.05));
  opacity:0;transition:opacity .2s;
}
.usc:hover{
  border-color:rgba(0,212,184,0.4);
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,0,0,0.3),0 0 0 1px rgba(0,212,184,0.1);
}
.usc:hover::before{opacity:1}
.usc:active{transform:scale(.97)}
.usc-av{
  grid-row:1/3;width:32px;height:32px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:13px;color:#fff;
  font-family:'Syne',sans-serif;
  position:relative;z-index:1;
}
.usc-name{
  font-size:11.5px;font-weight:700;color:var(--text);
  text-align:left;line-height:1.2;position:relative;z-index:1;
}
.usc-role{
  font-size:9.5px;color:var(--text3);
  text-align:left;margin-top:2px;position:relative;z-index:1;
}
.pin-dots{display:flex;gap:14px;justify-content:center;margin-bottom:22px}
.pin-dot{
  width:13px;height:13px;border-radius:50%;
  border:2px solid var(--border2);transition:all .18s;
}
.pin-dot.filled{
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  border-color:var(--accent);
  box-shadow:0 0 20px rgba(0,212,184,0.5);
  transform:scale(1.1);
}
.pin-pad{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:8px;max-width:280px;margin:0 auto 16px;
}
.pin-key{
  background:rgba(255,255,255,0.05);
  border:1px solid var(--border2);border-radius:12px;
  padding:15px;font-size:18px;font-weight:700;
  color:var(--text);cursor:pointer;transition:all .15s;
  font-family:'Syne',sans-serif;text-align:center;
  backdrop-filter:blur(8px);
}
:root.light .pin-key{background:var(--surface);border-color:var(--border2)}
.pin-key:hover:not(.empty){
  border-color:rgba(0,212,184,0.4);color:var(--accent);
  background:rgba(0,212,184,0.08);
  box-shadow:0 0 20px rgba(0,212,184,0.12);
}
.pin-key:active:not(.empty){transform:scale(.93)}
.pin-key.empty{background:none;border:none;cursor:default}
.bio-btn{
  width:100%;padding:12px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);border-radius:12px;
  color:var(--text2);font-size:13px;font-weight:600;
  cursor:pointer;transition:all .2s;
  font-family:'DM Sans',sans-serif;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
:root.light .bio-btn{background:var(--surface);border-color:var(--border2)}
.bio-btn:hover{
  border-color:rgba(0,212,184,0.3);color:var(--accent);
  background:rgba(0,212,184,0.06);
}
.bio-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}
.twofa-input{
  width:100%;padding:14px;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--border);border-radius:12px;
  color:var(--text);font-size:24px;font-weight:700;
  text-align:center;letter-spacing:10px;
  outline:none;font-family:'Syne',sans-serif;
  margin-bottom:12px;transition:all .2s;
}
:root.light .twofa-input{background:var(--surface)}
.twofa-input:focus{
  border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(0,212,184,0.08);
}
.login-submit{
  width:100%;padding:13px;
  background:linear-gradient(135deg,var(--accent),#7c4dff);
  color:#fff;border:none;border-radius:12px;
  font-size:14px;font-weight:700;cursor:pointer;
  font-family:'Syne',sans-serif;transition:all .2s;
  position:relative;overflow:hidden;
}
.login-submit:hover:not(:disabled){
  box-shadow:0 0 30px rgba(0,212,184,0.4),0 0 60px rgba(124,77,255,0.2);
  transform:translateY(-1px);
}
.login-submit:disabled{opacity:.4;cursor:not-allowed}
.login-resend{
  display:flex;align-items:center;justify-content:center;gap:6px;
  margin:10px auto 0;background:none;border:none;
  color:var(--text3);font-size:12px;cursor:pointer;
  font-family:'DM Sans',sans-serif;transition:color .14s;
}
.login-resend:hover{color:var(--accent)}
.login-resend svg{width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2}
.login-footer{
  margin-top:24px;display:flex;align-items:center;
  justify-content:space-between;font-size:10px;color:var(--text3);
  padding-top:16px;border-top:1px solid var(--border);
}

/* LOGIN RESPONSIVE */
@media(max-width:768px){
  .login-shell{
    grid-template-columns:1fr;
    min-height:100vh;
  }
  .login-showcase{
    padding:40px 24px 32px;
    min-height:auto;
    border-right:none;
    border-bottom:1px solid rgba(0,212,184,0.08);
  }
  .login-mark{width:120px;height:120px}
  .login-copy h1{font-size:26px}
  .login-metrics{margin-top:20px}
  .login-box{
    padding:32px 24px;
    min-height:auto;
    max-height:none;
  }
  .login-card-title{font-size:22px}
  .user-sel-grid{grid-template-columns:1fr 1fr}
  .pin-pad{max-width:260px}
}

@media(max-width:420px){
  .login-showcase{padding:28px 16px 24px}
  .login-mark{width:90px;height:90px}
  .login-copy h1{font-size:22px}
  .login-metrics{grid-template-columns:repeat(3,1fr);gap:6px}
  .login-box{padding:24px 16px}
  .user-sel-grid{grid-template-columns:1fr 1fr}
  .pin-pad{max-width:240px}
}
`

fs.writeFileSync('src/App.css', css + loginCSS)
console.log('Login CSS added successfully')
console.log('Total CSS lines:', (css + loginCSS).split('\n').length)