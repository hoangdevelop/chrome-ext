import axios from "axios";
const api = "https://covid19.mathdro.id/api/countries";
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const cases = document.querySelector(".cases");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");
const results = document.querySelector(".result-container");
results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";

const sendBtn = document.querySelector('.send-btn');

// grab the form
const form = document.querySelector(".form-data");
// grab the country name
const country = document.querySelector(".country-name");

// declare a method to search by country name
const searchForCountry = async countryName => {
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const response = await axios.get(`${api}/${countryName}`);
    loading.style.display = "none";
    cases.textContent = response.data.confirmed.value;
    recovered.textContent = response.data.recovered.value;
    deaths.textContent = response.data.deaths.value;
    results.style.display = "block";

    sendBtn.addEventListener("click", async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: ['Total cases: ' + cases.textContent],
        function: setPageBackgroundColor,
      });
    });

  } catch (error) {
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "We have no data for the country you have requested.";
  }
};

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  searchForCountry(country.value);
  console.log(country.value);
};

form.addEventListener("submit", e => handleSubmit(e));


async function setPageBackgroundColor(message) {
  //document.body.style.backgroundColor = 'red';

  // open chat area if not
  const iconChat = document.querySelectorAll('button.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.JsuyRc.boDUxc')[2];

  if (iconChat.getAttribute('aria-pressed') == 'false') {
    iconChat.click();
  }

  await sleep(1000);

  const chatbox = document.querySelector('textarea#bfTqV');
  chatbox.value = message;

  const sendBtn = document.querySelector('button.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.QDwDD.tWDL4c.Cs0vCd');
  sendBtn.removeAttribute('disabled')
  sendBtn.click();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
