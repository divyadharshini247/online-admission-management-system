/* =========================================================
   ONLINE ADMISSION MANAGEMENT SYSTEM
   ========================================================= */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyQjVV4i2z3ZlwPBzy8C_tE2gERKxPUoIht_VONLLsP54duWqrSETSUw0SyeewSrrL1WA/exec";


/* =========================================================
   API
   ========================================================= */

async function api(data) {

    const response = await fetch(
        SCRIPT_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)
        }
    );


    const textResponse =
        await response.text();


    console.log(
        "Apps Script response:",
        textResponse
    );


    try {

        return JSON.parse(textResponse);

    } catch (error) {

        throw new Error(
            "Invalid response from Apps Script: " +
            textResponse.substring(0, 200)
        );

    }

}


/* =========================================================
   COMMON FUNCTIONS
   ========================================================= */

function student() {

    try {

        return JSON.parse(
            sessionStorage.getItem("student")
        );

    } catch {

        return null;

    }

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value ?? "-";

    }

}


function showAlert(id, message, type) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        message || "";

    element.className =
        "alert " + (type || "");

}


function logout() {

    sessionStorage.clear();

    window.location.href =
        "login.html";

}


/* =========================================================
   LOGOUT
   ========================================================= */

const logoutButton =
    document.getElementById("logoutBtn");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const fullName =
                document
                .getElementById("fullName")
                .value
                .trim();


            const email =
                document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


            const mobile =
                document
                .getElementById("mobile")
                .value
                .trim();


            const password =
                document
                .getElementById("password")
                .value;


            const confirmPassword =
                document
                .getElementById("confirmPassword")
                .value;


            if (!fullName) {

                showAlert(
                    "alert",
                    "Please enter your full name.",
                    "error"
                );

                return;

            }


            if (
                !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
                .test(email)
            ) {

                showAlert(
                    "alert",
                    "Please enter a valid email.",
                    "error"
                );

                return;

            }


            if (!/^[6-9]\\d{9}$/.test(mobile)) {

                showAlert(
                    "alert",
                    "Enter a valid 10-digit mobile number.",
                    "error"
                );

                return;

            }


            if (password.length < 8) {

                showAlert(
                    "alert",
                    "Password must contain at least 8 characters.",
                    "error"
                );

                return;

            }


            if (password !== confirmPassword) {

                showAlert(
                    "alert",
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            const button =
                registerForm.querySelector(
                    "button[type='submit']"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "CREATING ACCOUNT...";

            }


            try {

                const result =
                    await api({

                        action: "register",

                        fullName: fullName,

                        email: email,

                        mobile: mobile,

                        password: password

                    });


                if (
                    result.status ===
                    "success"
                ) {

                    setText(
                        "studentId",
                        result.studentId
                    );


                    registerForm.style.display =
                        "none";


                    const formHead =
                        document.getElementById(
                            "formHead"
                        );

                    if (formHead) {

                        formHead.style.display =
                            "none";

                    }


                    const switchBox =
                        document.querySelector(
                            ".switch"
                        );

                    if (switchBox) {

                        switchBox.style.display =
                            "none";

                    }


                    const success =
                        document.getElementById(
                            "success"
                        );

                    if (success) {

                        success.style.display =
                            "block";

                    }


                    showAlert(
                        "alert",
                        "Registration successful!",
                        "success"
                    );


                } else {

                    showAlert(
                        "alert",
                        result.message ||
                        "Registration failed.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);

                showAlert(
                    "alert",
                    "Could not connect to the admission server.",
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "CREATE ACCOUNT";

                }

            }

        }
    );

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


            const password =
                document
                .getElementById("password")
                .value;


            if (!email || !password) {

                showAlert(
                    "alert",
                    "Please enter email and password.",
                    "error"
                );

                return;

            }


            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "SIGNING IN...";

            }


            try {

                const result =
                    await api({

                        action: "login",

                        email: email,

                        password: password

                    });


                if (
                    result.status ===
                    "success"
                ) {

                    sessionStorage.setItem(
                        "student",
                        JSON.stringify({

                            studentId:
                                result.studentId,

                            fullName:
                                result.fullName,

                            email:
                                result.email,

                            mobile:
                                result.mobile

                        })
                    );


                    window.location.href =
                        "dashboard.html";


                } else {

                    showAlert(
                        "alert",
                        result.message ||
                        "Invalid email or password.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);

                showAlert(
                    "alert",
                    "Could not connect to the admission server.",
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "LOGIN";

                }

            }

        }
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

const dashboard =
    document.getElementById("dashboard");


if (dashboard) {

    const s = student();


    if (!s) {

        window.location.href = "login.html";

    } else {

        /* STUDENT DETAILS */

        setText(
            "dName",
            s.fullName || "-"
        );

        setText(
            "dStudentId",
            s.studentId || "-"
        );

        setText(
            "pName",
            s.fullName || "-"
        );

        setText(
            "pEmail",
            s.email || "-"
        );

        setText(
            "pMobile",
            s.mobile || "-"
        );


        const startButton =
            document.getElementById("startBtn");


        /*
         * Load application from Apps Script
         */

        api({
            action: "getApplication",
            studentId: s.studentId
        })

        .then(function(result) {

            console.log(
                "Dashboard application response:",
                result
            );


            if (result.status === "success") {

                /*
                 * Support both possible response formats:
                 *
                 * 1. result.course
                 * 2. result.application.course
                 */

                const application =
                    result.application ||
                    result.data ||
                    result;


                /* Save application */

                sessionStorage.setItem(
                    "application",
                    JSON.stringify(application)
                );


                /* APPLICATION STATUS */

                setText(
                    "dApplicationStatus",
                    application.applicationStatus ||
                    application.status ||
                    "Submitted"
                );


                /* SELECTED COURSE */

                setText(
                    "dCourse",
                    application.course ||
                    application.Course ||
                    "Not Selected"
                );


                /*
                 * Application exists
                 */

                if (startButton) {

                    startButton.textContent =
                        "VIEW APPLICATION";

                    startButton.onclick =
                        function() {

                            window.location.href =
                                "my-application.html";

                        };

                }


            } else {

                /*
                 * No application submitted yet
                 */

                setText(
                    "dApplicationStatus",
                    "Not Submitted"
                );

                setText(
                    "dCourse",
                    "Not Selected"
                );


                if (startButton) {

                    startButton.textContent =
                        "START APPLICATION";

                    startButton.onclick =
                        function() {

                            window.location.href =
                                "admission.html";

                        };

                }

            }

        })

        .catch(function(error) {

            console.error(
                "Dashboard error:",
                error
            );


            /*
             * If API temporarily fails,
             * check locally saved application.
             */

            try {

                const saved =
                    JSON.parse(
                        sessionStorage.getItem(
                            "application"
                        )
                    );


                if (
                    saved &&
                    saved.course
                ) {

                    setText(
                        "dApplicationStatus",
                        saved.applicationStatus ||
                        "Submitted"
                    );

                    setText(
                        "dCourse",
                        saved.course
                    );


                    if (startButton) {

                        startButton.textContent =
                            "VIEW APPLICATION";

                        startButton.onclick =
                            function() {

                                window.location.href =
                                    "my-application.html";

                            };

                    }

                    return;

                }

            } catch (e) {

                console.error(e);

            }


            setText(
                "dApplicationStatus",
                "Not Submitted"
            );

            setText(
                "dCourse",
                "Not Selected"
            );


            if (startButton) {

                startButton.textContent =
                    "START APPLICATION";

                startButton.onclick =
                    function() {

                        window.location.href =
                            "admission.html";

                    };

            }

        });

    }

}

/* =========================================================
   COLLEGE + COURSE DATA
   ========================================================= */

function setupCollegeCourses() {

    const institutionType =
        document.getElementById(
            "institutionType"
        );


    const college =
        document.getElementById(
            "college"
        );


    const course =
        document.getElementById(
            "course"
        );


    if (
        !institutionType ||
        !college ||
        !course
    ) {

        return;

    }


    const data = {

        "Engineering": {

            "KIT Kalaignar Karunanidhi Institute of Technology": [

                "B.E. Computer Science and Engineering",

                "B.Tech. Artificial Intelligence and Data Science",

                "B.E. Electronics and Communication Engineering",

                "B.E. Electrical and Electronics Engineering",

                "B.E. Mechanical Engineering"

            ],


            "Coimbatore Institute of Technology": [

                "B.E. Computer Science and Engineering",

                "B.E. Information Technology",

                "B.E. Electronics and Communication Engineering",

                "B.E. Electrical and Electronics Engineering",

                "B.E. Mechanical Engineering"

            ],


            "Government College of Technology, Coimbatore": [

                "B.E. Computer Science and Engineering",

                "B.E. Information Technology",

                "B.E. Electronics and Communication Engineering",

                "B.E. Electrical and Electronics Engineering",

                "B.E. Mechanical Engineering"

            ]

        },


        "Arts & Science": {

            "PSG College of Arts & Science": [

                "B.Sc. Computer Science",

                "BCA",

                "B.Com.",

                "BBA"

            ],


            "Kongunadu Arts and Science College": [

                "B.Sc. Computer Science",

                "BCA",

                "B.Com.",

                "BBA"

            ],


            "Sri Krishna Arts and Science College": [

                "B.Sc. Computer Science",

                "BCA",

                "B.Com.",

                "BBA"

            ]

        }

    };


    function resetSelect(
        select,
        text
    ) {

        select.innerHTML =
            `<option value="">${text}</option>`;

    }


    institutionType.addEventListener(
        "change",
        function() {

            resetSelect(
                college,
                "Select College"
            );


            resetSelect(
                course,
                "Select Course"
            );


            college.disabled = true;

            course.disabled = true;


            const colleges =
                data[
                    institutionType.value
                ];


            if (colleges) {

                Object.keys(colleges)
                .forEach(function(name) {

                    college.add(
                        new Option(
                            name,
                            name
                        )
                    );

                });


                college.disabled =
                    false;

            }

        }
    );


    college.addEventListener(
        "change",
        function() {

            resetSelect(
                course,
                "Select Course"
            );


            const courses =
                data[
                    institutionType.value
                ]?.[
                    college.value
                ] || [];


            courses.forEach(
                function(name) {

                    course.add(
                        new Option(
                            name,
                            name
                        )
                    );

                }
            );


            course.disabled =
                !college.value;

        }
    );

}


/* =========================================================
   ADMISSION FORM
   ========================================================= */

const admissionForm =
    document.getElementById(
        "admissionForm"
    );


if (admissionForm) {

    const s = student();


    if (!s) {

        window.location.href =
            "login.html";

    } else {

        const fullName =
            document.getElementById(
                "fullName"
            );


        const email =
            document.getElementById(
                "email"
            );


        const phone =
            document.getElementById(
                "phone"
            );


        if (
            fullName &&
            !fullName.value
        ) {

            fullName.value =
                s.fullName || "";

        }


        if (
            email &&
            !email.value
        ) {

            email.value =
                s.email || "";

        }


        if (
            phone &&
            !phone.value
        ) {

            phone.value =
                s.mobile || "";

        }


        setupCollegeCourses();


        admissionForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const ids = [

                    "fullName",

                    "dob",

                    "gender",

                    "phone",

                    "email",

                    "city",

                    "address",

                    "tenthBoard",

                    "tenthYear",

                    "tenthMarks",

                    "twelfthBoard",

                    "twelfthYear",

                    "twelfthMarks",

                    "institutionType",

                    "college",

                    "course",

                    "category"

                ];


                for (
                    const id of ids
                ) {

                    const element =
                        document.getElementById(
                            id
                        );


                    if (
                        !element ||
                        !String(
                            element.value
                        ).trim()
                    ) {

                        if (element) {
                            element.focus();
                        }


                        showAlert(
                            "admissionMessage",
                            "Please complete all required fields.",
                            "error"
                        );

                        return;

                    }

                }


                const declaration =
                    document.getElementById(
                        "declaration"
                    );


                if (
                    !declaration ||
                    !declaration.checked
                ) {

                    showAlert(
                        "admissionMessage",
                        "Please accept the declaration.",
                        "error"
                    );

                    return;

                }


                const values = {

                    fullName:
                        document
                        .getElementById(
                            "fullName"
                        ).value.trim(),

                    dob:
                        document
                        .getElementById(
                            "dob"
                        ).value,

                    gender:
                        document
                        .getElementById(
                            "gender"
                        ).value,

                    phone:
                        document
                        .getElementById(
                            "phone"
                        ).value.trim(),

                    email:
                        document
                        .getElementById(
                            "email"
                        ).value.trim(),

                    city:
                        document
                        .getElementById(
                            "city"
                        ).value.trim(),

                    address:
                        document
                        .getElementById(
                            "address"
                        ).value.trim(),

                    tenthBoard:
                        document
                        .getElementById(
                            "tenthBoard"
                        ).value,

                    tenthYear:
                        document
                        .getElementById(
                            "tenthYear"
                        ).value,

                    tenthMarks:
                        document
                        .getElementById(
                            "tenthMarks"
                        ).value,

                    twelfthBoard:
                        document
                        .getElementById(
                            "twelfthBoard"
                        ).value,

                    twelfthYear:
                        document
                        .getElementById(
                            "twelfthYear"
                        ).value,

                    twelfthMarks:
                        document
                        .getElementById(
                            "twelfthMarks"
                        ).value,

                    institutionType:
                        document
                        .getElementById(
                            "institutionType"
                        ).value,

                    college:
                        document
                        .getElementById(
                            "college"
                        ).value,

                    course:
                        document
                        .getElementById(
                            "course"
                        ).value,

                    category:
                        document
                        .getElementById(
                            "category"
                        ).value

                };


                setText(
                    "reviewName",
                    values.fullName
                );

                setText(
                    "reviewDOB",
                    values.dob
                );

                setText(
                    "reviewGender",
                    values.gender
                );

                setText(
                    "reviewEmail",
                    values.email
                );

                setText(
                    "reviewPhone",
                    values.phone
                );

                setText(
                    "reviewCity",
                    values.city
                );

                setText(
                    "review10th",
                    values.tenthMarks
                );

                setText(
                    "review12th",
                    values.twelfthMarks
                );

                setText(
                    "reviewCollege",
                    values.college
                );

                setText(
                    "reviewCourse",
                    values.course
                );

                setText(
                    "reviewCategory",
                    values.category
                );


                const review =
                    document.getElementById(
                        "reviewSection"
                    );


                if (review) {

                    review.style.display =
                        "block";


                    review.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }

}


/* =========================================================
   PAYMENT + FINAL SUBMISSION
   ========================================================= */

const paymentButton =
    document.getElementById(
        "paymentButton"
    );


if (paymentButton) {

    paymentButton.addEventListener(
        "click",
        async function() {

            const s = student();


            if (!s) {

                window.location.href =
                    "login.html";

                return;

            }


            paymentButton.disabled =
                true;


            paymentButton.textContent =
                "SUBMITTING...";


            try {

                const payload = {

                    action:
                        "submitApplication",

                    studentId:
                        s.studentId,

                    fullName:
                        document
                        .getElementById(
                            "fullName"
                        )
                        .value.trim(),

                    dob:
                        document
                        .getElementById(
                            "dob"
                        ).value,

                    gender:
                        document
                        .getElementById(
                            "gender"
                        ).value,

                    phone:
                        document
                        .getElementById(
                            "phone"
                        ).value.trim(),

                    email:
                        document
                        .getElementById(
                            "email"
                        ).value.trim(),

                    city:
                        document
                        .getElementById(
                            "city"
                        ).value.trim(),

                    address:
                        document
                        .getElementById(
                            "address"
                        ).value.trim(),

                    tenthBoard:
                        document
                        .getElementById(
                            "tenthBoard"
                        ).value,

                    tenthYear:
                        document
                        .getElementById(
                            "tenthYear"
                        ).value,

                    tenthMarks:
                        document
                        .getElementById(
                            "tenthMarks"
                        ).value,

                    twelfthBoard:
                        document
                        .getElementById(
                            "twelfthBoard"
                        ).value,

                    twelfthYear:
                        document
                        .getElementById(
                            "twelfthYear"
                        ).value,

                    twelfthMarks:
                        document
                        .getElementById(
                            "twelfthMarks"
                        ).value,

                    institutionType:
                        document
                        .getElementById(
                            "institutionType"
                        ).value,

                    college:
                        document
                        .getElementById(
                            "college"
                        ).value,

                    course:
                        document
                        .getElementById(
                            "course"
                        ).value,

                    category:
                        document
                        .getElementById(
                            "category"
                        ).value

                };


                const application =
                    await api(
                        payload
                    );


                if (
                    application.status !==
                    "success"
                ) {

                    throw new Error(
                        application.message ||
                        "Application submission failed."
                    );

                }


                const payment =
                    await api({

                        action:
                            "payment",

                        applicationId:
                            application.applicationId,

                        amount:
                            5000

                    });


                if (
                    payment.status !==
                    "success"
                ) {

                    throw new Error(
                        payment.message ||
                        "Payment failed."
                    );

                }


                const savedApplication = {

                    applicationId:
                        application.applicationId,

                    studentId:
                        s.studentId,

                    fullName:
                        payload.fullName,

                    course:
                        payload.course,

                    applicationStatus:
                        "Submitted",

                    paymentStatus:
                        payment.paymentStatus ||
                        "Paid",

                    paymentReference:
                        payment.paymentReference ||
                        ""

                };


                sessionStorage.setItem(
                    "application",
                    JSON.stringify(
                        savedApplication
                    )
                );


                setText(
                    "paymentMessage",
                    "Application submitted successfully! Application ID: " +
                    application.applicationId +
                    " | Payment Reference: " +
                    (
                        payment.paymentReference ||
                        "Demo"
                    )
                );


                showAlert(
                    "paymentMessage",
                    "Application submitted successfully! Application ID: " +
                    application.applicationId,
                    "success"
                );


                paymentButton.textContent =
                    "APPLICATION SUBMITTED";


                setTimeout(
                    function() {

                        window.location.href =
                            "my-application.html";

                    },
                    2000
                );


            } catch (error) {

                console.error(error);


                showAlert(
                    "paymentMessage",
                    error.message ||
                    "Submission failed.",
                    "error"
                );


                paymentButton.disabled =
                    false;


                paymentButton.textContent =
                    "PAY ₹5,000 & SUBMIT";

            }

        }
    );

}


/* =========================================================
   MY APPLICATION
   ========================================================= */

const applicationPage =
    document.getElementById(
        "applicationPage"
    );


if (applicationPage) {

    const s = student();


    if (!s) {

        window.location.href =
            "login.html";

    } else {

        api({

            action:
                "getApplication",

            studentId:
                s.studentId

        })

        .then(function(result) {

            if (
                result.status !==
                "success"
            ) {

                showAlert(
                    "applicationAlert",
                    result.message ||
                    "No application found.",
                    "error"
                );

                return;

            }


            sessionStorage.setItem(
                "application",
                JSON.stringify(result)
            );


            setText(
                "applicationId",
                result.applicationId
            );

            setText(
                "applicationStatus",
                result.applicationStatus ||
                "Submitted"
            );

            setText(
                "aName",
                result.fullName
            );

            setText(
                "aDob",
                result.dob
            );

            setText(
                "aGender",
                result.gender
            );

            setText(
                "aPhone",
                result.phone
            );

            setText(
                "aEmail",
                result.email
            );

            setText(
                "aCity",
                result.city
            );

            setText(
                "a10Board",
                result.tenthBoard
            );

            setText(
                "a10Year",
                result.tenthYear
            );

            setText(
                "a10Marks",
                result.tenthMarks
            );

            setText(
                "a12Board",
                result.twelfthBoard
            );

            setText(
                "a12Year",
                result.twelfthYear
            );

            setText(
                "a12Marks",
                result.twelfthMarks
            );

            setText(
                "aInstitution",
                result.institutionType
            );

            setText(
                "aCollege",
                result.college
            );

            setText(
                "aCourse",
                result.course
            );

            setText(
                "aCategory",
                result.category
            );

            setText(
                "aPaymentStatus",
                result.paymentStatus ||
                "Paid"
            );

            setText(
                "aPaymentReference",
                result.paymentReference ||
                "-"
            );

            setText(
                "aDate",
                result.applicationDate ||
                "-"
            );


            const loading =
                document.getElementById(
                    "applicationLoading"
                );


            const content =
                document.getElementById(
                    "applicationContent"
                );


            if (loading) {

                loading.style.display =
                    "none";

            }


            if (content) {

                content.style.display =
                    "block";

            }

        })

        .catch(function(error) {

            console.error(error);

            showAlert(
                "applicationAlert",
                "Could not load application.",
                "error"
            );

        });

    }

}