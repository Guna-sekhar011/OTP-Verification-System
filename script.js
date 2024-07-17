document.addEventListener('DOMContentLoaded', () => {
    const otpForm = document.getElementById('otp-form');
    const verifyForm = document.getElementById('verify-form');
    const timerElement = document.getElementById('timer');
    const messageElement = document.getElementById('message');

    // Generate OTP and start timer
    if (otpForm) {
        otpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const generatedOTP = generateOTP();
            localStorage.setItem('generatedOTP', generatedOTP);
            localStorage.setItem('otpExpiryTime', Date.now() + 5 * 60 * 1000); // 5 minutes

            alert(`Your OTP is: ${generatedOTP}`); // Replace this with email sending logic
            window.location.href = 'verify.html';
        });
    }

    // Verify OTP
    if (verifyForm) {
        startTimer();
        verifyForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const otp = document.getElementById('otp').value;
            const generatedOTP = localStorage.getItem('generatedOTP');
            const otpExpiryTime = localStorage.getItem('otpExpiryTime');

            if (Date.now() > otpExpiryTime) {
                messageElement.textContent = 'OTP expired. Please request a new one.';
                messageElement.style.color = 'red';
                return;
            }

            if (otp === generatedOTP) {
                messageElement.textContent = 'OTP verified successfully!';
                messageElement.style.color = 'green';
                localStorage.removeItem('generatedOTP');
                localStorage.removeItem('otpExpiryTime');
            } else {
                messageElement.textContent = 'Invalid OTP. Please try again.';
                messageElement.style.color = 'red';
            }
        });
    }

    // Generate a 6-digit OTP
    function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Start timer for OTP validity
    function startTimer() {
        const otpExpiryTime = localStorage.getItem('otpExpiryTime');
        if (!otpExpiryTime) return;

        let remainingTime = otpExpiryTime - Date.now();

        if (remainingTime <= 0) {
            timerElement.textContent = 'OTP expired. Please request a new one.';
            return;
        }

        const interval = setInterval(() => {
            remainingTime -= 1000;
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            timerElement.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

            if (remainingTime <= 0) {
                clearInterval(interval);
                timerElement.textContent = 'OTP expired. Please request a new one.';
            }
        }, 1000);
    }
});
