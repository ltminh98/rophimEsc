const captureBtn = document.getElementById('captureBtn');
const statusText = document.getElementById('status');
const resultArea = document.getElementById('resultArea');
const urlDisplay = document.getElementById('urlDisplay');

captureBtn.addEventListener('click', () => {
    chrome.storage.local.set({ isCapturing: true });
    statusText.innerText = "Status: Chờ tý... Tải lại trang thử xem!.";
    captureBtn.innerText = "Chưa thấy gì...";
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "URL_FOUND") {
        const url = message.url;
        statusText.innerText = "Trạng thái: Đã tìm thấy link!";
        resultArea.classList.remove('hidden');
        urlDisplay.innerText = url;

        // Button: Copy Raw URL
        document.getElementById('copyUrlBtn').onclick = () => {
            navigator.clipboard.writeText(url);
            alert("URL đã copy!");
        };

        // Button: Copy IINA Terminal Command (Pre-formatted)
        document.getElementById('copyIinaBtn').onclick = () => {
            const iinaCmd = `/Applications/IINA.app/Contents/MacOS/iina-cli --mpv-http-header-fields="Referer: https://goatembed.com/,Origin: https://goatembed.com/,User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36" "${url}"`;
            navigator.clipboard.writeText(iinaCmd);
            alert("Đã copy IINA. Dán vào terminal để xem phim trên đó.");
        };
    }
});