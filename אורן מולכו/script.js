let scrollEnabled = true; // משתנה לסטטוס הגלילה
let scrollInterval;

// פונקציה להתחלת הגלילה
function startScroll(speed) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
    }, 4200 / speed);
}

// מאזין לאינפוט של מהירות הגלילה
document.querySelector('.circle-input').addEventListener('input', function () {
    const speed = parseInt(this.value, 10) || 0;
    if (speed === 0) {
        clearInterval(scrollInterval);
        return;
    }
    if (scrollEnabled) startScroll(speed);
});

// מאזינים לעצירת הגלילה והפעלה מחדש
document.body.addEventListener('click', toggleScroll);
document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // מונע את פעולת ברירת המחדל מהדף
        toggleScroll();
    });
});

function toggleScroll() {
    scrollEnabled = !scrollEnabled;
    if (!scrollEnabled) {
        clearInterval(scrollInterval);
    } else {
        const speed = parseInt(document.querySelector('.circle-input').value, 10) || 0;
        if (speed > 0) startScroll(speed);
    }
}

// פונקציה למחיקת תמונות
document.getElementById('deleteImages').addEventListener('click', function () {
    const imageContainer = document.getElementById('imageContainer');
    const canvas = document.getElementById('pdfCanvas');

    // מוחק את כל התמונות
    imageContainer.innerHTML = '';

    // מנקה את ה-PDF
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // מאפס את הקנבס
});

// פונקציה להעלאת תמונות חדשות
document.getElementById('uploadImages').addEventListener('click', function () {
    document.getElementById('fileInput').click(); // פותח את חלון העלאת הקבצים
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Uploaded Image';
            imageContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// פונקציה להעלאת קובץ PDF
document.getElementById('uploadPdf').addEventListener('click', function () {
    document.getElementById('pdfInput').click();
});

document.getElementById('pdfInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const pdfData = new Uint8Array(e.target.result);
            displayPDF(pdfData);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('אנא העלה קובץ PDF תקין');
    }
});

// פונקציה להצגת PDF
async function displayPDF(pdfData) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const container = document.getElementById('imageContainer');
    container.innerHTML = ''; // מנקה תוכן קודם

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 1.5; // שינוי גודל לפי הצורך
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        await page.render(renderContext).promise;
        container.appendChild(canvas); // מוסיף את הקנבס של הדף למכולה
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeMessageInstructions = document.getElementById('welcomeMessageInstructions');

    // פונקציה להסתרת אלמנט עם אפקט דהייה
    function hideElement(element) {
        if (element) {
            element.style.opacity = '0'; // אפקט דהייה
            setTimeout(() => {
                element.remove(); // הסרה מוחלטת מה-DOM
            }, 1000); // המתנה לסיום אפקט הדהייה
        }
    }

    // טיימרים להסתרת האלמנטים לאחר זמן קבוע
    setTimeout(() => hideElement(welcomeMessage), 20000); // 20 שניות
    setTimeout(() => hideElement(welcomeMessageInstructions), 20000); // 20 שניות

    // מאזין לאירועים לחיצה על האלמנטים עצמם
    if (welcomeMessage) {
        welcomeMessage.addEventListener('click', () => hideElement(welcomeMessage));
    }
    if (welcomeMessageInstructions) {
        welcomeMessageInstructions.addEventListener('click', () => hideElement(welcomeMessageInstructions));
    }

    // מאזין לאירועים לחיצה על הדף
    document.body.addEventListener('click', (e) => {
        // אם הלחיצה אינה על אחד האלמנטים עצמם
        if (
            e.target !== welcomeMessage &&
            e.target !== welcomeMessageInstructions &&
            !welcomeMessage.contains(e.target) &&
            !welcomeMessageInstructions.contains(e.target)
        ) {
            hideElement(welcomeMessage);
            hideElement(welcomeMessageInstructions);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('imageContainer');

    // הסרת התמונות הראשוניות בעת טעינת הדף
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
});
