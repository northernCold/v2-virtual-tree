let raf = (callback) => +setTimeout(callback, 16);
let caf = (num) => clearTimeout(num);

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = callback => window.requestAnimationFrame(callback);
  caf = handle => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafIds = new Map();

function cleanup(id) {
  rafIds.delete(id);
}

export default function wrapperRaf(callback, times = 1) {
  rafUUID += 1;
  const id = rafUUID;
  
  function callRef(leftTimes) {
    if (leftTimes === 0) {
      cleanup(id);
      callback();
    } else {
      const realId = raf(() => {
        callRef(leftTimes - 1);
      });
      rafIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
}

wrapperRaf.cancel = id => {
  const realId = rafIds.get(id);
  cleanup(realId);
  return caf(realId);
}