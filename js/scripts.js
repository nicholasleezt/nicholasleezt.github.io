$(document).ready(function () {
    console.log('jQuery version:', $.fn.jquery);

    let trainSchedulesPCKL = [];
    let trainSchedulesKLPC = [];

    // Load schedules for PC - KL
    $.getJSON('assets/schedule_pc_kl.json', function (data) {
        trainSchedulesPCKL = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Error loading JSON:', textStatus, error);
    });

    // Load schedules for KL - PC
    $.getJSON('assets/schedule_kl_pc.json', function (data) {
        trainSchedulesKLPC = data.schedules;
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Error loading JSON:', textStatus, error);
    });

    // Event handler for PC - KL button
    $('#getSchedulePCKL').click(function () {
        const now = new Date();
        const nextTrains = getNextTrains(now, trainSchedulesPCKL);
        displayTrains('PCKL', nextTrains);
    });

    // Event handler for KL - PC button
    $('#getScheduleKLPC').click(function () {
        const now = new Date();
        const nextTrains = getNextTrains(now, trainSchedulesKLPC);
        displayTrains('KLPC', nextTrains);
    });

    function getNextTrains(currentTime, schedules) {
        const upcomingTrains = schedules
            .map(schedule => {
                const departureTime = parseTime(schedule.departure);
                return { ...schedule, departureDate: departureTime };
            })
            .filter(schedule => schedule.departureDate > currentTime)
            .sort((a, b) => a.departureDate - b.departureDate);

        return upcomingTrains.slice(0, 5);
    }

    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        if (now < new Date()) {
            now.setDate(now.getDate() + 1); // Handle times past midnight
        }
        return now;
    }

    function convertTo12HourTime(time24) {
        // Split the input string into hours and minutes
        let [hours, minutes] = time24.split(":").map(Number);

        // Determine AM or PM based on the hours
        const period = hours >= 12 ? "PM" : "AM";

        // Convert hours to 12-hour format
        hours = hours % 12 || 12; // Convert 0 to 12 for midnight, and handle noon

        // Return the formatted time
        return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
    }

    function displayTrains(direction, trains) {
        const trainInfoId = direction === 'PCKL' ? '#trainInfoPCKL' : '#trainInfoKLPC';

        if (trains.length === 0) {
            $(trainInfoId).html('<p>No upcoming trains today</p>');
            return;
        }

        let info = '';
        trains.forEach(train => {
            const departure12 = convertTo12HourTime(train.departure);
            const arrival12 = convertTo12HourTime(train.arrival);
            info += `
          <p class="train-schedule">
            <a href="#" class="train-link link-underline link-underline-opacity-0 text-white" data-departure="${departure12}" data-arrival="${arrival12}">
              Departure: ${departure12} — Arrival: ${arrival12}
            </a>
          </p>
        `;
        });
        $(trainInfoId).html(info);
    }

    // Event listener for train links (both directions)
    $('.card-body').on('click', '.train-link', function (event) {
        event.preventDefault(); // Prevent default link behavior
        const departure = $(this).data('departure');
        const arrival = $(this).data('arrival');
        shareSchedule(departure, arrival);
    });

    function shareSchedule(departure, arrival) {
        if (navigator.share) {
            navigator.share({
                title: 'Train Schedule',
                text: `Departure: ${departure}, Arrival: ${arrival}`,
                // Optionally include a URL
                // url: window.location.href
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.error('Error sharing', error));
        } else {
            alert('Web Share API is not supported in your browser.');
        }
    }
});
