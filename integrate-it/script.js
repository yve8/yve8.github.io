const formulaLink = document.getElementById("formulalink");
const formulaDetails = document.getElementById("basicformulas");
formulaLink.addEventListener("click", () => {
    formulaDetails.setAttribute("open", "");
})