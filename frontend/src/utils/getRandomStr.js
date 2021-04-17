export let rs = "";

(() => {
  const abc = "abcdefghijklmnopqrstuvwxyz";
  while (rs.length < 6) {
    rs += abc[Math.floor(Math.random() * abc.length)];
  }
})();

console.log(rs);
console.log(rs);
