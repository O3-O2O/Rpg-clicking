// Lấy session user từ localStorage
const userSession = JSON.parse(localStorage.getItem("user_session"));

// timer dùng để tự đóng dropdown
let autoCloseTimer = null;

// kiểm tra chuột có đang hover vào dropdown hay không
let isHoveringDropdown = false;


// ==============================
// HÀM MỞ / ĐÓNG DROPDOWN
// ==============================
function dropDown(btn) {

    // tìm phần tử cha gần nhất có class .content-in
    const container = btn.closest(".content-in");
    if (!container) return; // nếu không tìm thấy thì dừng

    // tìm dropdown bên trong container
    const dropdown = container.querySelector(".size-inside");
    if (!dropdown) return; // nếu không có dropdown thì dừng

    // ==============================
    // ĐÓNG NHỮNG DROPDOWN KHÁC
    // ==============================
    document.querySelectorAll(".content-in.active").forEach(el => {
        if (el !== container) {
            el.classList.remove("active"); // remove active để đóng dropdown khác
        }
    });

    // kiểm tra dropdown hiện tại có đang đóng không
    const isOpening = !container.classList.contains("active");

    // bật / tắt dropdown
    container.classList.toggle("active");

    // nếu đang mở dropdown thì bật auto close
    if (isOpening) {
        setupAutoClose(container, dropdown);
    } else {
        // nếu đóng thì xóa timer
        clearTimeout(autoCloseTimer);
    }
}


// ==============================
// HÀM TỰ ĐÓNG DROPDOWN
// ==============================
function setupAutoClose(container, dropdown) {

    // xóa timer cũ
    clearTimeout(autoCloseTimer);

    // mặc định chưa hover
    isHoveringDropdown = false;

    // sau 1.5s nếu không hover thì đóng dropdown
    autoCloseTimer = setTimeout(() => {
        if (!isHoveringDropdown) {
            container.classList.remove("active");
        }
    }, 1500);

    // ==============================
    // KHI CHUỘT VÀO DROPDOWN
    // ==============================
    dropdown.onmouseenter = () => {
        isHoveringDropdown = true; // đánh dấu đang hover
        clearTimeout(autoCloseTimer); // hủy auto close
    };

    // ==============================
    // KHI CHUỘT RỜI DROPDOWN
    // ==============================
    dropdown.onmouseleave = () => {
        isHoveringDropdown = false;

        // sau 1.5s sẽ đóng dropdown
        autoCloseTimer = setTimeout(() => {
            container.classList.remove("active");
        }, 1500);
    };
}


// ==============================
// CLICK NGOÀI DROPDOWN → ĐÓNG
// ==============================
document.addEventListener("click", function (e) {

    // nếu click không nằm trong .content-in
    if (!e.target.closest(".content-in")) {

        // đóng tất cả dropdown đang mở
        document.querySelectorAll(".content-in.active")
            .forEach(el => el.classList.remove("active"));
    }

});

window.gamePlay = () => {

    window.location.href = "rpg_clicking.html"

}

window.websiteInfo = () => {

    window.location.href = "menu.html"

}
window.accountLog = () => {

    window.location.href = "main_acc.html"

}

window.discordPage = () => {

    window.location.href = "https://discord.gg/G3FEGW39"

}

window.buyingPage = () => {

    window.location.href = "rpg_store.html"

}

window.commentPage = async () => {
    document.querySelector(".comment").classList.add("active");
}

document.querySelector(".closeComment").onclick = () => {
    document.querySelector(".comment").classList.remove("active");
}

document.querySelector(".submitComment").onclick = async () => {
    
    
    if(document.querySelector(".inputComment").value == ""){

        alert("No report detected")

    }else{

        try{

            const text = document.querySelector(".inputComment").value.trim()
            await db.collection("comments")
                .doc(userSession.uid)
                .set({

                    text: text,
                    uid: userSession.uid,
                    email: userSession.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()

                })
        } catch (err){

            console.log(err)

        }

        document.querySelector(".inputComment").value = ""
        alert("Succesfully send your report")
        

    }

    document.querySelector(".comment").classList.remove("active");
}


window.logOut = async function () {

    if (!userSession) {
        window.location.href = "signIn_signUp.html";
        return;
    }

    // (OPTIONAL) hỏi trước khi logout
    const confirmLogout = confirm("Do you want to log out?");
    if (!confirmLogout) return;

    try {
        // (OPTIONAL) save game trước khi thoát
        if (typeof saveGame === "function") {
            await saveGame();
        }

        // Firebase logout
        await firebase.auth().signOut();

        // Xóa session local
        localStorage.removeItem("user_session");
        sessionStorage.clear();

        // Quay về trang login
        window.location.href = "signIn_signUp.html";

    } catch (error) {
        console.error("Logout error:", error);
        alert("Failed to log out!");
    }
};