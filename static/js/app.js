document.addEventListener("DOMContentLoaded", function () {
    const eventsTable = document.getElementById("eventsTable");
    const searchResultsSection = document.getElementById("search-results");
    const searchTableBody = document.getElementById("resultsBody");
    const noEventsMessage = "No events booked yet.";

    // Sample data for events (you can replace this with actual data from your backend)
    const events = [
        {
            clientName: "John Doe",
            eventType: "Barat",
            eventDate: "2024-10-05",
            totalInvoice: 5000,
            advance: 2000,
            firstInstallment: 1000,
            secondInstallment: 1500,
            thirdInstallment: 500,
            remainingBalance: 500
        },
        {
            clientName: "Jane Smith",
            eventType: "Walima",
            eventDate: "2024-11-15",
            totalInvoice: 7000,
            advance: 3000,
            firstInstallment: 2000,
            secondInstallment: 1500,
            thirdInstallment: 500,
            remainingBalance: 0
        }
    ];

    // Load and render events on page load
    function loadEvents() {
        if (events.length === 0) {
            displayNoDataMessage(eventsTable);
        } else {
            renderTable(eventsTable, events);
        }
    }

    // Display "No events booked yet" message if no events exist
    function displayNoDataMessage(table) {
        const container = table.parentElement;
        container.innerHTML = `<p>${noEventsMessage}</p>`;
    }

    // Function to render the table with data
    function renderTable(table, eventData) {
        table.style.display = "table";
        eventData.forEach(event => {
            const row = table.insertRow();
            row.insertCell(0).textContent = event.clientName;
            row.insertCell(1).textContent = event.eventType;
            row.insertCell(2).textContent = event.eventDate;
            row.insertCell(3).textContent = event.totalInvoice;
            row.insertCell(4).textContent = event.advance;
            row.insertCell(5).textContent = event.firstInstallment || "-";
            row.insertCell(6).textContent = event.secondInstallment || "-";
            row.insertCell(7).textContent = event.thirdInstallment || "-";
            row.insertCell(8).textContent = event.remainingBalance;
        });
    }

    // Load events when the page loads
    loadEvents();

    // For the search functionality
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Clear the previous results
        searchTableBody.innerHTML = '';

        // Get search values
        const searchTerm = document.getElementById("searchTerm").value.toLowerCase();
        const searchDate = document.getElementById("searchDate").value;

        // Filter events based on search input
        const filteredEvents = events.filter(event => {
            const matchesTerm = event.clientName.toLowerCase().includes(searchTerm) || event.eventType.toLowerCase().includes(searchTerm);
            const matchesDate = searchDate ? event.eventDate === searchDate : true;
            return matchesTerm && matchesDate;
        });

        // If no results, hide the results table
        if (filteredEvents.length === 0) {
            searchResultsSection.style.display = "none";
        } else {
            searchResultsSection.style.display = "block";
            renderTable(searchTableBody, filteredEvents);
        }
    });
});
