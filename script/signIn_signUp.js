document.addEventListener("DOMContentLoaded", function () {

    /* ================= CAPTCHA ================= */
    // const captchaText = document.getElementById("catcha-random");
    const captchaInput = document.getElementById("catcha-take");

    // const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // let captcha = "";

    // const generateCaptcha = () => {
    //     captcha = "";
    //     for (let i = 0; i < 5; i++) {
    //         captcha += chars[Math.floor(Math.random() * chars.length)];
    //     }
    //     captchaText.textContent = captcha;
    // };

    // generateCaptcha();

    let realCaptcha = "";

        function generateCaptcha(){

            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz1234567890";
            realCaptcha = "";

            for(let i=0;i<5;i++){
                realCaptcha += chars.charAt(Math.floor(Math.random()*chars.length));
            }

            const canvas = document.getElementById("captchaCanvas");
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.fillStyle="#fff";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.font="26px Arial";
            ctx.fillStyle="#111";

            for(let i=0;i<realCaptcha.length;i++){
                ctx.save();
                ctx.translate(20 + i*20, 28);
                ctx.rotate((Math.random()-0.5)*0.5);
                ctx.fillText(realCaptcha[i],0,0);
                ctx.restore();
            }

            // noise
            for(let i=0;i<20;i++){
                ctx.strokeStyle="rgba(0,0,0,0.3)";
                ctx.beginPath();
                ctx.moveTo(Math.random()*130, Math.random()*45);
                ctx.lineTo(Math.random()*130, Math.random()*45);
                ctx.stroke();
            }
        }

        generateCaptcha();

/* Click canvas để đổi mã */
        document.getElementById("captchaCanvas").addEventListener("click",generateCaptcha);


    /* ================= LOGIN ================= */
    const loginForm = document.getElementById("subm");
    const usernameInput = document.getElementById("fname");
    const passwordInput = document.getElementById("lname");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!usernameInput.value || !passwordInput.value) {
            alert("Please input all information");
            return;
        }

        if (captchaInput.value !== realCaptcha) {
            alert("Wrong captcha");
            generateCaptcha();
            return;
        }

        auth.signInWithEmailAndPassword(
            usernameInput.value,
            passwordInput.value
        )
            .then((userCredential) => {
                alert("Successfully log in");

                localStorage.setItem(
                    "user_session",
                    JSON.stringify(userCredential.user)
                );

                window.location.href = "menu.html";
            })
            .catch((error) => {
                alert("Wrong account or password");
                console.error(error.code, error.message);
            });
    });

    /* ================= SIGN UP ================= */
    const signUpForm = document.getElementById("form_dn");

    signUpForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("gma").value;
        const password = document.getElementById("mkh").value;
        const confirm = document.getElementById("re_mkh").value;

        if (!email || !password || !confirm) {
            alert("Please input all information");
            return;
        }

        if (password !== confirm) {
            alert("Password is not correct");
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // CHỈ CHẠY KHI EMAIL CHƯA TỒN TẠI
                return db.collection("users")
                    .doc(userCredential.user.uid)
                    .set({
                        uid: userCredential.user.uid,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
            })
            .then(() => {
                alert("Successfully sign in");
                window.location.href = "menu.html";
            })
            .catch((error) => {

                if (error.code === "auth/email-already-in-use") {
                    alert("Account existed. Please log in!");
                    return;
                }

                if (error.code === "auth/invalid-email") {
                    alert("Invalid Email");
                    return;
                }

                if (error.code === "auth/weak-password") {
                    alert("Password has to contain at least 6 characters");
                    return;
                }

                alert("Failed to regist");
                console.error(error.code, error.message);
            });
    });
});

/* ================= BACKGROUND CHANGER ================= */
const bgCh = document.getElementById("bg-ch");

function login_changer(e) {
    if (e) e.preventDefault();
    bgCh.style.position = "absolute";
    bgCh.style.right = "0px";
    bgCh.style.left = "auto";
}

function signIn_changer(e) {
    if (e) e.preventDefault();
    bgCh.style.position = "absolute";
    bgCh.style.left = "0px";
    bgCh.style.right = "auto";
}
