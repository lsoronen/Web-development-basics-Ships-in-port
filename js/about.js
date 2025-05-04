
document.addEventListener('DOMContentLoaded', () => {
    let visitCount = localStorage.getItem("visitCount") || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);

    const footer = document.querySelector("footer p");

    footer.innerHTML=`You have loaded this site ${visitCount} times.`
});
