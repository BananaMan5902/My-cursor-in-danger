(() => {
  if (window.__stickmanFighterLoaded) return;
  window.__stickmanFighterLoaded = true;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let x = mouseX;
  let y = mouseY;
  let hits = 0;
  let level = 0;
  let attacking = false;

  const weapons = [
    "👊",
    "🔪",
    "🔨",
    "🔫",
    "💣",
    "⚔️"
  ];

  const requiredHits = [8, 10, 12, 14, 16];

  const style = document.createElement("style");

  style.textContent = `
    #scf-stickman {
      position: fixed;
      left: 0;
      top: 0;
      width: 90px;
      height: 110px;
      z-index: 2147483647;
      pointer-events: none;
      user-select: none;
      transform-origin: center;
      font-family: Arial, sans-serif;
    }

    #scf-body {
      position: absolute;
      left: 35px;
      top: 30px;
      width: 20px;
      height: 48px;
      background: #111;
      border-radius: 10px;
    }

    #scf-head {
      position: absolute;
      left: 25px;
      top: 0;
      width: 40px;
      height: 40px;
      background: white;
      border: 5px solid #111;
      border-radius: 50%;
      box-sizing: border-box;
    }

    #scf-eye1,
    #scf-eye2 {
      position: absolute;
      top: 12px;
      width: 5px;
      height: 5px;
      background: #111;
      border-radius: 50%;
    }

    #scf-eye1 {
      left: 9px;
    }

    #scf-eye2 {
      right: 9px;
    }

    #scf-arm1,
    #scf-arm2 {
      position: absolute;
      width: 45px;
      height: 9px;
      background: #111;
      top: 38px;
      border-radius: 8px;
      transform-origin: left center;
    }

    #scf-arm1 {
      left: 8px;
      transform: rotate(145deg);
    }

    #scf-arm2 {
      left: 50px;
      transform: rotate(35deg);
    }

    #scf-leg1,
    #scf-leg2 {
      position: absolute;
      width: 9px;
      height: 48px;
      background: #111;
      top: 72px;
      border-radius: 8px;
      transform-origin: top center;
    }

    #scf-leg1 {
      left: 36px;
      transform: rotate(25deg);
    }

    #scf-leg2 {
      left: 48px;
      transform: rotate(-25deg);
    }

    #scf-weapon {
      position: absolute;
      font-size: 30px;
      left: 53px;
      top: 24px;
      filter: drop-shadow(2px 2px 2px #000);
    }

    #scf-hud {
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 2147483647;
      background: rgba(0,0,0,.8);
      color: white;
      padding: 12px 18px;
      border-radius: 12px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      pointer-events: none;
    }

    #scf-message {
      position: fixed;
      left: 50%;
      top: 25%;
      transform: translate(-50%, -50%);
      z-index: 2147483647;
      color: white;
      background: rgba(0,0,0,.9);
      padding: 20px 35px;
      border-radius: 15px;
      font: bold 28px Arial;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s;
    }

    .scf-punch {
      animation: scfPunch .18s ease-out;
    }

    @keyframes scfPunch {
      0% {
        transform: scale(1) rotate(0);
      }

      50% {
        transform: scale(1.15) rotate(-8deg);
      }

      100% {
        transform: scale(1) rotate(0);
      }
    }

    .scf-ko {
      animation: scfKO .8s ease-out forwards;
    }

    @keyframes scfKO {
      0% {
        transform: rotate(0) scale(1);
      }

      50% {
        transform: rotate(90deg) scale(1.1);
      }

      100% {
        transform: rotate(180deg) scale(.3);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(style);

  const stickman = document.createElement("div");
  stickman.id = "scf-stickman";

  stickman.innerHTML = `
    <div id="scf-head">
      <div id="scf-eye1"></div>
      <div id="scf-eye2"></div>
    </div>

    <div id="scf-body"></div>

    <div id="scf-arm1"></div>
    <div id="scf-arm2"></div>

    <div id="scf-leg1"></div>
    <div id="scf-leg2"></div>

    <div id="scf-weapon">${weapons[0]}</div>
  `;

  document.body.appendChild(stickman);

  const hud = document.createElement("div");
  hud.id = "scf-hud";
  document.body.appendChild(hud);

  const message = document.createElement("div");
  message.id = "scf-message";
  document.body.appendChild(message);

  function updateHUD() {
    if (level < 5) {
      hud.innerHTML =
        `🕴️ Stickman Fighter<br>` +
        `Weapon: ${weapons[level]}<br>` +
        `Hits: ${hits}/${requiredHits[level]}<br>` +
        `Stage: ${level + 1}/6`;
    } else {
      hud.innerHTML =
        `🕴️ Stickman Fighter<br>` +
        `⚔️ EXCALIBUR<br>` +
        `Hits: ${hits}<br>` +
        `FINAL STAGE`;
    }
  }

  function showMessage(text) {
    message.textContent = text;
    message.style.opacity = "1";

    setTimeout(() => {
      message.style.opacity = "0";
    }, 1200);
  }

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.addEventListener("click", event => {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 75) {
      hits++;

      stickman.classList.remove("scf-punch");
      void stickman.offsetWidth;
      stickman.classList.add("scf-punch");

      updateHUD();

      if (level < 5 && hits >= requiredHits[level]) {
        level++;
        hits = 0;

        stickman.classList.add("scf-ko");

        setTimeout(() => {
          stickman.classList.remove("scf-ko");

          document.getElementById("scf-weapon").textContent =
            weapons[level];

          if (level === 5) {
            showMessage("⚔️ EXCALIBUR UNLOCKED!");
          } else {
            showMessage(
              "NEW WEAPON: " + weapons[level]
            );
          }

          updateHUD();
        }, 850);
      }
    }
  });

  function gameLoop() {
    const dx = mouseX - x;
    const dy = mouseY - y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 45) {
      const speed = level >= 3 ? 2.8 : 2.1;

      x += (dx / distance) * speed;
      y += (dy / distance) * speed;
    }

    const angle =
      Math.atan2(mouseY - y, mouseX - x) * 180 / Math.PI;

    stickman.style.transform =
      `translate(${x - 45}px, ${y - 55}px) rotate(${angle}deg)`;

    requestAnimationFrame(gameLoop);
  }

  updateHUD();
  gameLoop();
})();
