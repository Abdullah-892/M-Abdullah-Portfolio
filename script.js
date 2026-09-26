
/* =========================================
   THEME TOGGLE
========================================= */

const themeToggle =
    document.querySelector(".theme-toggle-pill");

const savedTheme =
    localStorage.getItem("portfolio-theme");


/* -----------------------------------------
   LOAD SAVED THEME
----------------------------------------- */

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}


/* -----------------------------------------
   THEME TOGGLE
----------------------------------------- */

if (themeToggle) {

    const isLight =
        document.body.classList.contains("light-theme");

    themeToggle.setAttribute(
        "aria-pressed",
        isLight ? "true" : "false"
    );


    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "light-theme"
            );


            const lightMode =
                document.body.classList.contains(
                    "light-theme"
                );


            /* Save preference */

            localStorage.setItem(
                "portfolio-theme",
                lightMode
                    ? "light"
                    : "dark"
            );


            /* Accessibility */

            themeToggle.setAttribute(
                "aria-pressed",
                lightMode
                    ? "true"
                    : "false"
            );

        }
    );

}


/* =========================================
   MOBILE NAVIGATION
========================================= */

const mobileMenuBtn =
    document.querySelector("#mobileMenuBtn");

const navCenter =
    document.querySelector(".nav-center");

const navLinks =
    document.querySelectorAll(".nav-links a");


if (mobileMenuBtn && navCenter) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            const isOpen =
                navCenter.classList.toggle(
                    "active"
                );


            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );


            const icon =
                mobileMenuBtn.querySelector("i");


            if (icon) {

                icon.classList.toggle(
                    "fa-bars",
                    !isOpen
                );

                icon.classList.toggle(
                    "fa-xmark",
                    isOpen
                );

            }

        }
    );


    /* Close menu after clicking a link */

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navCenter.classList.remove(
                        "active"
                    );


                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuBtn.querySelector("i");


                    if (icon) {

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   CONTACT FORM
========================================= */

/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.querySelector("#contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -----------------------------------------
               GET FORM DATA
            ----------------------------------------- */

            const formData =
                new FormData(contactForm);


            const data = {

                name:
                    formData.get("name").trim(),

                email:
                    formData.get("email").trim(),

                subject:
                    formData.get("subject").trim(),

                message:
                    formData.get("message").trim()

            };


            /* -----------------------------------------
               SUBMIT BUTTON
            ----------------------------------------- */

            const submitButton =
                contactForm.querySelector(
                    ".submit-btn"
                );


            const buttonText =
                submitButton.querySelector("span");


            const buttonIcon =
                submitButton.querySelector("i");


            const originalText =
                buttonText.textContent;


            /* -----------------------------------------
               LOADING STATE
            ----------------------------------------- */

            submitButton.disabled = true;

            buttonText.textContent =
                "Sending...";


            if (buttonIcon) {

                buttonIcon.className =
                    "fa-solid fa-spinner fa-spin";

            }


            try {

                /* -----------------------------------------
                   SEND DATA TO BACKEND
                ----------------------------------------- */

                const response =
                    await fetch(
                        "/api/contact",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                if (
                    response.ok &&
                    result.success
                ) {

                    alert(
                        "Message sent successfully! I will get back to you soon."
                    );


                    contactForm.reset();

                }


                /* -----------------------------------------
                   ERROR
                ----------------------------------------- */

                else {

                    alert(
                        result.message ||
                        "Unable to send your message. Please try again."
                    );

                }

            }


            catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                alert(
                    "Unable to connect to the server. Please try again later."
                );

            }


            finally {

                /* -----------------------------------------
                   RESTORE BUTTON
                ----------------------------------------- */

                submitButton.disabled = false;

                buttonText.textContent =
                    originalText;


                if (buttonIcon) {

                    buttonIcon.className =
                        "fa-solid fa-paper-plane";

                }

            }

        }
    );

}