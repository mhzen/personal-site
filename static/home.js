document.addEventListener("DOMContentLoaded", () => {
  // --- Live Clock & Greeting ---
  const timeEl = document.getElementById("weather-time");
  const greetingEl = document.getElementById("weather-greeting");

  function updateClock() {
    // UTC+7 (Yogyakarta)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const yogyaTime = new Date(utcTime + (3600000 * 7));

    let hours = yogyaTime.getHours();
    let minutes = yogyaTime.getMinutes();

    // Formatting
    const displayHours = hours.toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    if (timeEl) timeEl.textContent = `${displayHours} : ${displayMinutes}`;

    if (greetingEl) {
      if (hours < 12) greetingEl.textContent = "Selamat pagi";
      else if (hours < 18) greetingEl.textContent = "Selamat siang";
      else greetingEl.textContent = "Selamat malam";
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  // --- Weather (Open-Meteo) ---
  const tempEl = document.getElementById("weather-temp-val");
  const descEl = document.getElementById("weather-desc");
  const weatherIcon = document.getElementById("weather-icon");

  // Yogyakarta coordinates
  const lat = -7.7971;
  const lon = 110.3688;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia%2FJakarta`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      const current = data.current_weather;
      if (current && tempEl && descEl) {
        tempEl.textContent = `${Math.round(current.temperature)}°C`;

        // Simple WMO Weather code mapping
        const code = current.weathercode;
        let desc = "Clear";
        let iconHtml = `<svg viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6.166 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.061-1.06l-1.59-1.591z"/></svg>`; // Sun

        if (code === 1 || code === 2 || code === 3) { desc = "Partly cloudy"; iconHtml = `<svg viewBox="0 0 24 24"><path d="M6.75 11.25a5.25 5.25 0 1110.057-1.42 4.5 4.5 0 11-1.554 8.67H7.5a4.5 4.5 0 01-1.554-8.67 5.23 5.23 0 01.804-1.42V11.25z"/></svg>`; }
        else if (code >= 45 && code <= 48) { desc = "Fog"; }
        else if (code >= 51 && code <= 67) { desc = "Rain"; iconHtml = `<svg viewBox="0 0 24 24"><path d="M6.75 11.25a5.25 5.25 0 1110.057-1.42 4.5 4.5 0 11-1.554 8.67H7.5a4.5 4.5 0 01-1.554-8.67 5.23 5.23 0 01.804-1.42V11.25zM10.5 19.5v2.25M13.5 19.5v2.25"/></svg>`; }
        else if (code >= 71 && code <= 82) { desc = "Snow"; }
        else if (code >= 95 && code <= 99) { desc = "Thunderstorm"; }

        descEl.textContent = desc;
        if (weatherIcon) weatherIcon.innerHTML = iconHtml;
      }
    })
    .catch(err => console.error("Weather fetch error:", err));

  // --- Last.fm (Recently Played) ---
  const songTitleEl = document.getElementById("lastfm-song");
  const artistEl = document.getElementById("lastfm-artist");
  const bgEl = document.getElementById("lastfm-bg");

  const lastfmUser = "wrham";
  const lastfmUrl = `https://lastfm-last-played.biancarosa.com.br/${lastfmUser}/latest-song`;

  fetch(lastfmUrl)
    .then(response => response.json())
    .then(data => {
      if (data && data.track) {
        if (songTitleEl) songTitleEl.textContent = data.track.name;
        if (artistEl && data.track.artist) artistEl.textContent = data.track.artist['#text'];

        // Find largest image
        if (bgEl && data.track.image && data.track.image.length > 0) {
          const images = data.track.image;
          const largestImg = images[images.length - 1]['#text'];
          if (largestImg) {
            bgEl.src = largestImg;
            bgEl.style.display = 'block';
          }
        }
      }
    })
    .catch(err => console.error("Lastfm fetch error:", err));
});
