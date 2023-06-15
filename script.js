const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      // Party deleted successfully
      // Refresh the party list
      const parties = await getAllParties();
      renderParties(parties);
    } else {
      console.error('Failed to delete party');
    }
  } catch (error) {
    console.error(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);

    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
      <h3>Guests:</h3>
      <ul></ul>
      <button class="close-button">Close</button>
    `;

    // Add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.style.display = 'none';
    });

    return partyDetailsElement;
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    for (const party of parties) {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <button class="details-button" data-id="${party.id}">See Details</button>
        <button class="delete-button" data-id="${party.id}">Delete</button>
      `;
      partyContainer.appendChild(partyElement);

      // see details
const detailsButton = partyElement.querySelector('.details-button');
detailsButton.addEventListener('click', async () => {
  const partyId = detailsButton.dataset.id;
  const partyDetailsElement = await renderSinglePartyById(partyId);
  partyElement.appendChild(partyDetailsElement);
  // Toggle visibility of party details element
  partyDetailsElement.style.display = partyDetailsElement.style.display === 'none' ? 'block' : 'none';
  // Toggle visibility of original party details
  partyElement.querySelector('p').style.display = partyElement.querySelector('p').style.display === 'none' ? 'block' : 'none';
});


      // delete party
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        const partyId = event.target.getAttribute('data-id');
        await deleteParty(partyId);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  try {
    const parties = await getAllParties();
    renderParties(parties);
  } catch (error) {
    console.error(error);
  }
};

init();