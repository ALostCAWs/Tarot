/*
-- ANIMATIONS --
*/
function animateIn() {
   images.forEach(img => {
      if (img.id > 1) {
         img.classList.add('animateIn');
         img.classList.remove('clickable');
      }
   });
   setTimeout(animateShuffle, 1000);
}

function animateShuffle() {
   let top = document.getElementById("78");
   let mid = document.getElementById("77");
   top.classList.add('top');
   mid.classList.add('mid');
   top.classList.add('shuffle');
   mid.classList.add('shuffle');
}

function animateOut() {
   images.forEach(img => {
      if (img.id > 1) {
         img.classList.add('animateOut');
         img.classList.remove('animateIn');
         img.classList.add('clickable');
      }
   });
   setTimeout(removeAnim, 1000);
}

function removeAnim() {
   images.forEach(img => {
      if (img.id > 1) {
         img.classList.remove('animateOut');
         img.classList.remove('top');
         img.classList.remove('mid');
         img.classList.remove('shuffle');
         img.marginLeft = '-84px';
      }
   });
}