function message(type, text, imgSrc) {
    let mask = document.createElement("div");
    mask.className = "msgMask";
    
    mask.innerHTML = `
    <div class = "msgMask">
        <table class = "msg">
            <tr>
                <td class = "msgBody">
                    <img class = "msgImg" src = "${imgSrc}">
                </td>
                <td class = "msgBody">
                   ${text}
                </td>
            </tr>
        </table>
    </div>
    `;
    
    mask.addEventListener("click", (e) => this.remove());
}