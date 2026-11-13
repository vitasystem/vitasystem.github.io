/* VITA SYSTEM — Stage 2 player fire, separate from the 6 MB game.
   Keeps the original rabbit charge, enemy waves, and all other levels intact. */
(() => {
  'use strict';
  if (window.__vitaStage2PlayerFire) return;
  if (typeof STATE === 'undefined' || typeof C === 'undefined' ||
      typeof ctx === 'undefined' || typeof drawL2 !== 'function' ||
      typeof updateL2 !== 'function') return;
  window.__vitaStage2PlayerFire = true;

  const shots = [];
  const DAMAGE = 0.4;
  const SHOT_SPEED = 1000;
  const FIRE_INTERVAL = 0.2;
  let cooldown = 0;

  function canvasPoint(ev) {
    const r = C.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1000, (ev.clientX - r.left) * 1000 / r.width)),
      y: Math.max(0, Math.min(560, (ev.clientY - r.top) * 560 / r.height))
    };
  }
  function closestEnemy(point) {
    return STATE.enemies.reduce((best, enemy) => {
      const distance = Math.hypot(enemy.x - point.x, enemy.y - point.y);
      return !best || distance < best.distance ? {enemy, distance} : best;
    }, null)?.enemy;
  }
  function playerFire(point) {
    if (STATE.level !== 2 || STATE.mode !== 'play' ||
        cooldown > 0 || !STATE.enemies.length) return;
    const enemy = closestEnemy(point);
    if (!enemy) return;
    STATE.reticle = point;
    cooldown = FIRE_INTERVAL;
    shots.push({x:500, y:480, oldX:500, oldY:505, target:enemy});
    beep('fire');
  }
  // Capture first so the old "wait" message doesn't block a player's shot
  // when all enemies have already been assigned to charging rabbits.
  C.addEventListener('pointerdown', ev => {
    if (STATE.level !== 2 || STATE.mode !== 'play') return;
    const point = canvasPoint(ev);
    if (STATE.enemies.length && STATE.enemies.every(enemy => enemy.pending)) {
      ev.stopImmediatePropagation();
    }
    playerFire(point);
    // When an enemy is available, the original listener still sends a
    // rabbit while this independent player projectile flies toward it.
  }, {capture:true});

  const originalUpdateL2 = updateL2;
  updateL2 = function (dt) {
    cooldown = Math.max(0, cooldown - dt);
    originalUpdateL2(dt);
    if (STATE.level !== 2 || STATE.mode !== 'play') {
      shots.length = 0;
      return;
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const shot = shots[i], enemy = shot.target;
      if (!STATE.enemies.includes(enemy)) {
        shots.splice(i, 1);
        continue;
      }
      shot.oldX = shot.x;
      shot.oldY = shot.y;
      const dx = enemy.x - shot.x, dy = enemy.y - shot.y;
      const distance = Math.hypot(dx, dy);
      const move = Math.min(distance, SHOT_SPEED * dt);
      if (distance > 0) {
        shot.x += dx / distance * move;
        shot.y += dy / distance * move;
      }
      if (distance <= 22 || move >= distance) {
        shots.splice(i, 1);
        enemy.hp = Math.max(0, enemy.hp - DAMAGE);
        STATE.hits++;
        STATE.score += 15;
        flash(enemy.x, enemy.y, 'hit');
        beep('hit');
        if (enemy.hp <= 0) {
          STATE.enemies = STATE.enemies.filter(item => item !== enemy);
          STATE.killed++;
          STATE.score += 125;
          STATE.loot++;
          flash(enemy.x, enemy.y, 'boom');
          toast(t('ВЛУЧАННЯ! ВОРОГА ЗНИЩЕНО', 'DIRECT HIT! ENEMY DESTROYED'), .65);
        }
      }
    }
  };

  const originalDrawL2 = drawL2;
  drawL2 = function () {
    originalDrawL2();
    for (const shot of shots) {
      ctx.save();
      ctx.shadowColor = '#f4a5ff';
      ctx.shadowBlur = 20;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#e98cff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(shot.oldX, shot.oldY);
      ctx.lineTo(shot.x, shot.y);
      ctx.stroke();
      ctx.strokeStyle = '#fff6ff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  // A new game starts with an empty player magazine and no leftover shots.
  const originalNextLevel = nextLevel;
  nextLevel = function (level) {
    shots.length = 0;
    cooldown = 0;
    return originalNextLevel(level);
  };
})();
